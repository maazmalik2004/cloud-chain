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

class Database {
    constructor() {
        const nodeUrls = [];
        this.gun = Gun({
            peers: nodeUrls,
            file: "persistent-store",
            radisk: true,
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

// await db.set("key1",{})
// await db.set("key2",[])
// await db.set("key3",null)
// await db.set("key4",69)
// await db.set("key5","hello world")

// const key1 = await db.get("key1");
// const key2 = await db.get("key2");
// const key3 = await db.get("key3");
// const key4 = await db.get("key4");
// const key5 = await db.get("key5");

// console.log("key1:", key1);
// console.log("key2:", key2);
// console.log("key3:", key3);
// console.log("key4:", key4);
// console.log("key5:", key5);
