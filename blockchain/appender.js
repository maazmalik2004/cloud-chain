import database from "../database/database.js";
import { parentPort } from 'worker_threads';
import crypto from 'crypto';

let blockchain = await database.get("blockchain");
let mempool = await database.get("mempool");

async function append() {
    setInterval(async () => {
        blockchain = await database.get("blockchain");
        // console.log(blockchain)

        const nextBlockToBeAppended = await getNextBlockToBeAppended();
        if (nextBlockToBeAppended !== -1) {
            // console.log(blockchain)
            const blockToAppend = mempool[nextBlockToBeAppended];
            console.log(blockToAppend)
            
            const merkleRoot = calculateMerkleRoot(blockToAppend["data"])
            blockToAppend["merkleRoot"] = merkleRoot

            const previousBlock = blockchain[blockchain.length-1]
            const previousBlockHash = calculateHash(JSON.stringify(previousBlock))
            blockToAppend["previousHash"] = previousBlockHash

            mempool.splice(nextBlockToBeAppended, 1);
            blockchain.push(blockToAppend);
            await database.set("mempool", mempool);
            await database.set("blockchain", blockchain);
            // console.log(`[APPENDER][APPEND][${new Date().toISOString()}] appended block ${nextBlockToBeAppended}`);
        } else {
            // console.log(`[APPENDER][APPEND][${new Date().toISOString()}] no blocks left to append`);
        }
    }, 1000);
}

async function getNextBlockToBeAppended() {
    mempool = await database.get("mempool");
    if(!mempool){
        mempool = []
    }
    for (let key = 0; key < mempool.length; key++) {
        if (mempool[key]["validated"] === true) {
            return key;
        }
    }
    return -1;
}

function calculateMerkleRoot(data) {
    let entries = data.map(entry => JSON.stringify(entry)); // Ensure all entries are strings

    if (entries.length === 1) {
        return calculateHash(entries[0]);
    }

    let nextLevel = [];

    for (let i = 0; i < entries.length; i += 2) {
        const left = entries[i];
        const right = i + 1 < entries.length ? entries[i + 1] : entries[i];
        nextLevel.push(calculateHash(left + right));
    }

    return calculateMerkleRoot(nextLevel);
}

function calculateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

append();
