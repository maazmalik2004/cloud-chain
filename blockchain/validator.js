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
            console.log(`[VALIDATOR][VALIDATE][${new Date().toISOString()}] validating block ${nextBlockToBeValidated} ${JSON.stringify(mempool[nextBlockToBeValidated])}`);
            // Simulate block validation (skipping the actual validation for now)
            mempool[nextBlockToBeValidated]["validated"] = true;
            await database.set("mempool", mempool);
        } else {
            console.log(`[VALIDATOR][VALIDATE][${new Date().toISOString()}] mempool empty. no blocks left to validate`);
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

validate();
