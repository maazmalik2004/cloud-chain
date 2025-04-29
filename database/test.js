import Database from "./database.js";
const database = new Database()

// const actualData : {

// }


await database.set("key5",{
    data:"string"
})

console.log(await database.get("key5"))

// await database.set("mempool",{
//     0:{ source: "5678", validated: false, data: "Block 1 data" },
//     1:{ source: "1234", validated: false, data: "Block 2 data" },
//     2:{ source: "5678", validated: false, data: "Block 3 data" },
//     3:{ source: "9101", validated: false, data: "Block 4 data" }
// })

// console.log(await database.get("mempool"))


// import database from "../blockchain/validator.js";

// const runTest = async () => {
//     // const database = new Database();
    
//     // await database.set("mempool", {
//     //     0: { source: "5678", validated: false, data: "Block 1 data" },
//     //     1: { source: "1234", validated: false, data: "Block 2 data" },
//     //     2: { source: "5678", validated: false, data: "Block 3 data" },
//     //     3: { source: "9101", validated: false, data: "Block 4 data" }
//     // });
    
//     const result = await database.get("mempool");
//     console.log("Retrieved data:", JSON.stringify(result, null, 2));
//     console.log("Retrieved data:", JSON.stringify(result, null, 2));
//     console.log("Retrieved data:", JSON.stringify(result, null, 2));
// };

// runTest().catch(err => console.error("Error in test:", err));

// console.log(await database.get("mempool"))