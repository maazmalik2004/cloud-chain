import { setKeyValue, getValue } from '../dbClient.js';

class Database {
    constructor() {
        // No internal state currently needed
    }

    async get(key) {
        const result = await getValue(key);
        return result?.value; // optional chaining to avoid crashing if result is undefined
    }

    async set(key, value) {
        await setKeyValue(key, value);
    }
}

const db = new Database();
export default db;
