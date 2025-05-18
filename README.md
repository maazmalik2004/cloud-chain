# CloudChain- Federated cloud on the blockchain

![Screenshot 2025-05-01 100139](https://github.com/user-attachments/assets/5af07ae7-9eb2-4659-90ea-c652233985e0)

## Installation
```bash
npm install
```

## Configuration- identity.json

```json
{
    "identifier": "peer1",
    "port": 3000,
}
```

## Configuration- peer-config.json

```json
{
    "peers": ["http://localhost:3000/gun","http://localhost:3001/gun","http:localhost:3002/gun"]
} 
```
### http:localhost:3002/gun is the synchronization server

## Run the synchronization server

```bash
node gunServer.js
```

## Run the CloudChain client interface

```bash
node index.js
```

```command
# peer1@CloudChain :  » SHOW PROFILES
```
![image](https://github.com/user-attachments/assets/f3b9777b-9f85-46d3-b92c-7a5c0959a27f)

```command
# peer1@CloudChain :  » SHOW BLOCKCHAIN
```
![image](https://github.com/user-attachments/assets/c9c1ccbe-29c7-4afb-b92f-44ae7ffcaec6)

```command
# peer1@CloudChain :  » TRANSACT INVESTMENT <AMOUNT IN MU>
```
### Validation output on other peer
![image](https://github.com/user-attachments/assets/a15e963e-9041-4ae0-aac5-27afd9c32687)

```command
# peer1@CloudChain :  » TRANSACT DATA '["TRANSACTION 1","TRANSACTION 2","..."]'
```
### Stake added for a data transaction
![image](https://github.com/user-attachments/assets/9cb19445-1d36-48bc-99d9-18039e4fef74)

### Validation output on other peer
![image](https://github.com/user-attachments/assets/37973534-c714-4a36-8b42-3df4f30bd77e)

### Registry state after reward distribution
![image](https://github.com/user-attachments/assets/b19770f3-8a51-4622-bf3f-ee9b6b748367)

```command
# peer1@CloudChain :  » LAUNCH
```
### Provisions an ubuntu container with the memory you own
![image](https://github.com/user-attachments/assets/96c16b9d-166d-4532-94b7-b288d99473bb)

### Access container via ssh
![image](https://github.com/user-attachments/assets/6d0a14dc-097d-4bb9-89aa-a4afb45e19ef)

```command
# peer1@CloudChain :  » TERMINATE
```
### Stops the provisioned container
