// import fs from "fs/promises"

// class JsonFileInterface {
//     constructor() {
//     }

//     async read(path) {
//         try {
//             const data = await fs.readFile(path, "utf8")
//             return JSON.parse(data)
//         } catch (error) {
//             throw new Error(`failed to read ${path}`)
//         }
//     }

//     async write(path, data) {
//         try {
//             const stringifiedData = JSON.stringify(data, null, 4)
//             await fs.writeFile(path, stringifiedData, "utf8")
//         } catch (error) {
//             throw new Error(`failed to write data ${JSON.stringify(data)} to ${path}`)
//         }
//     }
// }

// export default JsonFileInterface

import fs from "fs"

class JsonFileInterface {
    constructor() {}

    read(path) {
        try {
            const data = fs.readFileSync(path, "utf8")
            return JSON.parse(data)
        } catch (error) {
            throw new Error(`failed to read ${path}`)
        }
    }

    write(path, data) {
        try {
            const stringifiedData = JSON.stringify(data, null, 4)
            fs.writeFileSync(path, stringifiedData, "utf8")
        } catch (error) {
            throw new Error(`failed to write data ${JSON.stringify(data)} to ${path}`)
        }
    }
}

// export default JsonFileInterface

const jsonFileInterface = new JsonFileInterface
// console.log(f.read("./identity.json"))
export default jsonFileInterface