import database from "../database/database.js";
import { parentPort } from 'worker_threads';

let blockchain = await database.get("blockchain");
let mempool = await database.get("mempool");

async function append() {
    setInterval(async () => {
        const nextBlockToBeAppended = await getNextBlockToBeAppended();
        if (nextBlockToBeAppended !== -1) {
            const blockToAppend = mempool[nextBlockToBeAppended];
            mempool.splice(nextBlockToBeAppended, 1);
            blockchain.push(blockToAppend);
            await database.set("mempool", mempool);
            await database.set("blockchain", blockchain);
            console.log(`[APPENDER][APPEND][${new Date().toISOString()}] appended block ${nextBlockToBeAppended}`);
        } else {
            console.log(`[APPENDER][APPEND][${new Date().toISOString()}] no blocks left to append`);
        }
    }, 1000);
}

async function getNextBlockToBeAppended() {
    mempool = await database.get("mempool");
    for (let key = 0; key < mempool.length; key++) {
        if (mempool[key]["validated"] === true) {
            return key;
        }
    }
    return -1;
}

append();
