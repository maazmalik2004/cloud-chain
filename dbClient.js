const baseUrl = 'http://localhost:4000'; // Replace with actual port like 3000

/**
 * Set a key-value pair on the server
 * @param {string} key
 * @param {any} value
 */
export async function setKeyValue(key, value) {
  const response = await fetch(`${baseUrl}/set`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key, value })
  });

  if (!response.ok) {
    throw new Error(`Error setting key: ${await response.text()}`);
  }

  return await response.json();
}

/**
 * Get a value by key
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getValue(key) {
  const response = await fetch(`${baseUrl}/get/${encodeURIComponent(key)}`);

  if (!response.ok) {
    throw new Error(`Error getting key: ${await response.text()}`);
  }

  return await response.json();
}

/**
 * Get server configuration
 * @returns {Promise<any>}
 */
export async function getConfig() {
  const response = await fetch(`${baseUrl}/config`);

  if (!response.ok) {
    throw new Error(`Error fetching config: ${await response.text()}`);
  }

  return await response.json();
}

/**
 * Get list of peer nodes
 * @returns {Promise<any>}
 */
export async function getPeers() {
  const response = await fetch(`${baseUrl}/peers`);

  if (!response.ok) {
    throw new Error(`Error fetching peers: ${await response.text()}`);
  }

  return await response.json();
}
