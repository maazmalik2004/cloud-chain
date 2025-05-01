import database from "../database/database.js";
import { parentPort } from 'worker_threads';

// await database.set("mempool",[
//     { source: "5678", validated: false, data: "Block 1 data" },
//     { source: "1234", validated: false, data: "Block 2 data" },
//     { source: "5678", validated: false, data: "Block 3 data" },
//     { source: "9101", validated: false, data: "Block 4 data" }
// ])

let mempool = await database.get("mempool");

async function validate() {
    setInterval(async () => {
        const nextBlockToBeValidated = await getNextBlockToBeValidated();

        if (nextBlockToBeValidated !== -1) {
            // console.log(`[VALIDATOR][VALIDATE][${new Date().toISOString()}] validating block ${nextBlockToBeValidated} ${JSON.stringify(mempool[nextBlockToBeValidated])}`);
            // Simulate block validation (skipping the actual validation for now)

            //before validation
            updateRegistry(mempool[nextBlockToBeValidated]["data"])

            mempool[nextBlockToBeValidated]["validated"] = true;

            //after validation
            await database.set("mempool", mempool);
            if(mempool[nextBlockToBeValidated]["validated"] == true){
                await conductReward(mempool[nextBlockToBeValidated]["source"])
            }
        } else {
            // console.log(`[VALIDATOR][VALIDATE][${new Date().toISOString()}] mempool empty. no blocks left to validate`);
        }
    }, 1000);
}

async function getNextBlockToBeValidated() {
    mempool = await database.get("mempool");
    for (let key = 0; key < mempool.length; key++) {
        if (mempool[key]["validated"] === false) {
            return key;
        }
    }
    return -1;
}

async function updateRegistry(transactions) {
    const registry = await database.get("registry")

    transactions.map(t => {
        if(t.type == "stake"){
            const source = t.source
            const amount = t.amount
            //we subtract stake amount from capacity wallet of source
            registry[source]["capacityWallet"] -= amount
            registry[source]["stake"] += amount
        }

        if(t.type == "investment"){
            const source = t.source
            const amount = t.amount
            //we subtract stake amount from capacity wallet of source
            registry[source]["capacityWallet"] -= amount
            registry[source]["investment"] += amount
        }
    })

    await database.set("registry",registry)
    // console.log(await database.get("registry"))
}

async function conductReward(source) {
    console.log("conducting reward")
    const registry = await database.get("registry");

    let netInvestment = 0;
    let netStake = 0;

    // Calculate total investment and stake
    Object.keys(registry).forEach(key => {
        netInvestment += registry[key].investment;
        netStake += registry[key].stake;
    });

    console.log(netStake)

    // Avoid division by zero
    if (netStake === 0) {
        console.warn("No stake in the registry. Aborting reward distribution.");
        return;
    }

    const myStake = registry[source].stake;
    const myFractionStake = myStake / netStake;

    console.log(myFractionStake)

    const reward = (netInvestment / 2) * myFractionStake;

    console.log(reward)

    // Reduce others' investment proportionally
    Object.keys(registry).forEach(key => {
        const user = registry[key];
        user.investment -= (user.investment / 2) * myFractionStake;
    });

    // Add reward to source's capacityWallet
    registry[source].capacityWallet += reward;
    registry[source].capacityWallet += registry[source].stake

    //make the stake 0 
    registry[source].stake = 0

    // Optionally save updated registry
    await database.set("registry", registry);
}

validate();
