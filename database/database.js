// // 

// import Gun from "gun";
// // import SEA from "gun/sea.js"

// class Database {
//     constructor() {
//         const nodeUrls = [];
//         //we will get nodeUrls from peers-config
//         this.gun = Gun({
//             peers: nodeUrls,
//             file: "persistent-store",
//             radisk: true,
//             // multicast:true
//         });
//     }

//     get(key) {
//         return new Promise((resolve) => {
//             this.gun.get(key).once((data) => {
//                 console.log(`[DATABASE][GET][${new Date().toISOString()}] key ${key} data ${JSON.stringify(data, null, 4)}`)
//                 resolve(JSON.parse(data.data));
//             });
//         });
//     }

//     set(key, value){
//         this.gun.get(key).put({
//             data:JSON.stringify(value)
//         }).once(data => {
//             console.log(`[DATABASE][SET][${new Date().toISOString()}] key ${key} data ${JSON.stringify(data, null, 4)}`)
//         });
//         return value;
//     }
// }

// // export default Database;

// const db = new Database()

// export default db

// // const nestedObject = {
// //     user: {
// //       id: 1,
// //       name: "Alice",
// //       contact: {
// //         email: "alice@example.com",
// //         phone: {
// //           home: "123-456-7890",
// //           mobile: "098-765-4321"
// //         }
// //       },
// //       preferences: {
// //         notifications: {
// //           email: true,
// //           sms: false
// //         },
// //         theme: "dark"
// //       }
// //     },
// //     posts: [
// //       {
// //         id: 101,
// //         title: "First Post",
// //         comments: [
// //           { id: 1001, text: "Great post!" },
// //           { id: 1002, text: "Thanks for sharing." }
// //         ]
// //       },
// //       {
// //         id: 102,
// //         title: "Second Post",
// //         comments: []
// //       }
// //     ]
// //   };
  

// // await db.set("key2",["aalu","gobi","tamater"])
// // console.log(await db.get("key2"))

import Gun from "gun";
import jsonFileInterface from "../JsonFileInterface.js";
class Database {
    constructor() {
        console.log(jsonFileInterface.read("./peers-config.json").peers)
        console.log(jsonFileInterface.read("./identity.json").port)
        this.gun = Gun({
            peers: jsonFileInterface.read("./peers-config.json").peers,
            // peers:['http://localhost:4001/gun'],
            file: "persistent-store",
            radisk: true,
            listen:jsonFileInterface.read("./identity.json").port
        });
    }

    get(key) {
        return new Promise((resolve) => {
            this.gun.get(key).once((data) => {
                // console.log(`[DATABASE][GET][${new Date().toISOString()}] key ${key} data ${JSON.stringify(data, null, 4)}`);
                if (!data) {
                    resolve(null);
                } else if (data.data) {
                    try {
                        resolve(JSON.parse(data.data));
                    } catch {
                        resolve(null);
                    }
                } else {
                    resolve(this.cleanGunData(data));
                }
            });
        });
    }

    set(key, value) {
        return new Promise((resolve) => {
            this.gun.get(key).put({ data: JSON.stringify(value) }).once((data) => {
                // console.log(`[DATABASE][SET][${new Date().toISOString()}] key ${key} data ${JSON.stringify(data, null, 4)}`);
                resolve(value);
            });
        });
    }

    cleanGunData(data) {
        const result = [];
        Object.keys(data).forEach(key => {
            if (key !== '_' && typeof data[key] === 'object' && data[key] !== null && !data[key]['#']) {
                result.push(data[key]);
            }
        });
        return result;
    }
}

const db = new Database();
export default db;