// import { setKeyValue, getValue } from '../dbClient.js';

// class Database {
//     constructor() {
//         // No internal state currently needed
//     }

//     async get(key) {
//         const result = await getValue(key);
//         return result?.value; // optional chaining to avoid crashing if result is undefined
//     }

//     async set(key, value) {
//         await setKeyValue(key, value);
//     }
// }

// const db = new Database();
// export default db;

// // import Gun from "gun";
// // import jsonFileInterface from "../JsonFileInterface.js";
// // class Database {
// //     constructor() {
// //         // console.log(jsonFileInterface.read("./peers-config.json").peers)
// //         // console.log(jsonFileInterface.read("./identity.json").port)
// //         this.gun = Gun({
// //             peers: jsonFileInterface.read("./peers-config.json").peers,
// //             // peers:['http://localhost:4001/gun'],
// //             file: "persistent-store",
// //             radisk: true,
// //             listen:jsonFileInterface.read("./identity.json").port
// //         });
// //     }

// //     get(key) {
// //         return new Promise((resolve) => {
// //             this.gun.get(key).once((data) => {
// //                 // console.log(`[DATABASE][GET][${new Date().toISOString()}] key ${key} data ${JSON.stringify(data, null, 4)}`);
// //                 if (!data) {
// //                     resolve(null);
// //                 } else if (data.data) {
// //                     try {
// //                         resolve(JSON.parse(data.data));
// //                     } catch {
// //                         resolve(null);
// //                     }
// //                 } else {
// //                     resolve(this.cleanGunData(data));
// //                 }
// //             });
// //         });
// //     }

// //     set(key, value) {
// //         return new Promise((resolve) => {
// //             this.gun.get(key).put({ data: JSON.stringify(value) }).once((data) => {
// //                 // console.log(`[DATABASE][SET][${new Date().toISOString()}] key ${key} data ${JSON.stringify(data, null, 4)}`);
// //                 resolve(value);
// //             });
// //         });
// //     }

// //     cleanGunData(data) {
// //         const result = [];
// //         Object.keys(data).forEach(key => {
// //             if (key !== '_' && typeof data[key] === 'object' && data[key] !== null && !data[key]['#']) {
// //                 result.push(data[key]);
// //             }
// //         });
// //         return result;
// //     }
// // }

// // const db = new Database();
// // export default db;

import { setKeyValue, getValue } from '../dbClient.js';

// class Database {
//     constructor() {
//         // No internal state currently needed
//     }

//     async get(key) {
//         const result = await getValue(key);
//         return result?.value; // optional chaining to avoid crashing if result is undefined
//     }

//     async set(key, value) {
//         await setKeyValue(key, value);
//     }
// }

// const db = new Database();
// export default db;

import Gun from "gun";
import jsonFileInterface from "../JsonFileInterface.js";
class Database {
    constructor() {
        // console.log(jsonFileInterface.read("./peers-config.json").peers)
        // console.log(jsonFileInterface.read("./identity.json").port)
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
        setKeyValue(key, value);
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