import database from "../database/database.js";
import crypto from 'crypto';
import { Worker } from 'worker_threads';
import jsonFileInterface from "../JsonFileInterface.js";

class Blockchain {
    constructor() {
        this.database = database;
        this.validator;
        this.appender;
        this.identity = jsonFileInterface.read("./identity.json").identifier
        console.log(this.identity)
    }

    async initializeBlockchain() {
        const blockchain = await this.database.get("blockchain");
        const mempool = await this.database.get("mempool");
        // const pot = await this.database.get("pot")
        const registry = await this.database.get("registry")
        console.log(registry)

        if (!blockchain || blockchain.length === 0) {
            await this.createGenesisBlock();
        }

        if (!mempool || !Array.isArray(mempool)) {
            await this.createMempool();
        }

        if(!registry){
            await this.createRegistry();
        }

        this.validator = new Worker('./blockchain/validator.js');
        this.appender = new Worker("./blockchain/appender.js")
    }

    async createGenesisBlock() {
        const genesisData = [
            {
                type: "data",
                data: "if it ain't broke, don't fix it",
                source: this.identity,
                target: "network",
                amount: 0,
                unit: "mu"
            }
        ];
        const merkleRoot = this.calculateMerkleRoot(genesisData);

        const genesisBlock = {
            timestamp: new Date().toISOString(),
            previousHash: null,
            merkleRoot: merkleRoot,
            data: genesisData,
            validated: true,
            source: "network",
            stakeAmount:0,
            unit:"mu"
        };

        await this.database.set('blockchain', [genesisBlock]);
    }

    async createMempool() {
        const mempool = [];
        await this.database.set('mempool', mempool);
    }

    async createRegistry(){
        const registry = {
            // network : {
            //     investment:0
            // },
            maaz:{
                capacityWallet:100,
                unit:"mu",
                stake:0,
                investment:0,
            },
            malik:{
                capacityWallet:100,
                unit:"mu",
                stake:0,
                investment:0
            }
        }
        await this.database.set("registry",registry)
        console.log("billa meow meow")
        console.log(await this.database.get("registry"))
    }

    async addData(transactions){
        transactions = transactions.map(t => ({
            type: "data",
            data: t,
            source: this.identity,
            target: "network",
            amount: 0,
            unit: "mu"
        }));

        transactions.push({
            type: "stake",
            data: "this is stake for adding a block",
            source: this.identity,
            target: "network",
            amount: 1,
            unit: "mu"
        })

        await this.addBlock(transactions)
    }

    async addSpecial(transaction){
        await this.addBlock(transaction)
    }

    async addBlock(transactions) {

        const blockchain = await this.database.get("blockchain")
        if (!blockchain || blockchain.length === 0) {
            throw new Error("Blockchain not initialized.");
        }
    
        // const lastBlock = blockchain[blockchain.length - 1];
        // const previousHash = this.calculateHash(JSON.stringify(lastBlock));
        // const merkleRoot = this.calculateMerkleRoot(transactions);
    
        const block = {
            timestamp: new Date().toISOString(),
            // previousHash: previousHash,
            // merkleRoot: merkleRoot,
            data: transactions,
            // stakeAmount:1,
            // unit:"mu",
            validated: false,
            source: this.identity
        };
    
        const mempool = await this.database.get("mempool");
        mempool.push(block);
        await this.database.set("mempool", mempool);
    }

    async invest(memoryUnits){
        const investment = {
            investmentAmount:memoryUnits,
            unit:"mu",
            type:"investment",
            source:this.identity,
        }

        const investmentTransaction = {
            type:"investment",
            data:"this is an investment transaction",
            source:this.identity,
            target:"network",
            amount:memoryUnits,
            unit:"mu"
        }

        await this.addSpecial([investmentTransaction])
    }

    calculateMerkleRoot(data) {
        let entries = data.map(entry => JSON.stringify(entry)); // Ensure all entries are strings
    
        if (entries.length === 1) {
            return this.calculateHash(entries[0]);
        }
    
        let nextLevel = [];
    
        for (let i = 0; i < entries.length; i += 2) {
            const left = entries[i];
            const right = i + 1 < entries.length ? entries[i + 1] : entries[i];
            nextLevel.push(this.calculateHash(left + right));
        }
    
        return this.calculateMerkleRoot(nextLevel);
    }
    
    calculateHash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

const blockchain = new Blockchain();
await blockchain.initializeBlockchain();
export default blockchain

// await bc.addData(["block1data1", "block1data2", "block1data3"])

// await bc.addData(["block2data1", "block2data2", "block2data3"]);

// //from maaz
// await bc.addData(["block3data1", "block3data2", "block3data3"]);
// await bc.addData(["block4data1", "block4data2", "block4data3"]);

// await bc.invest(10)

// await bc.addData(["block5data1", "block5data2", "block5data3"]);

// await bc.addData(["block6data1", "block6data2", "block6data3"]);

// await bc.addData([{
//     value:"this is an data of object form from maaz and this is so cool"
// }]);

// await bc.addData(["block7data1", "block7data2", "block7data3"]);

// setTimeout(async () => {
//   console.log(JSON.stringify(await database.get("blockchain"),null,4));
//   console.log(JSON.stringify(await database.get("registry"),null,4));
// }, 5000);