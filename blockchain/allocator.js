import database from "../database/database.js";
import { parentPort } from 'worker_threads';

async function allocate(){
    setInterval(async()=>{
        const registry = await database.get("registry")
        console.log("inside allocate ",registry)

        //orchestrate virtual machines based on registry ie capacity wallet
    },1000)
}