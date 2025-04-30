import jsonFileInterface from "./JsonFileInterface.js";

import boxen from "boxen"
import enquirer from 'enquirer';
import { json } from "express";
const { prompt } = enquirer;
import { Command } from 'commander';
const program = new Command();

import shellQuote from "shell-quote"

console.log(`\x1b[34m
    ____ _                 _  ____ _           _       
   / ___| | ___  _   _  __| |/ ___| |__   __ _(_)_ __  
  | |   | |/ _ \\| | | |/ _\` | |   | '_ \\ / _\` | | '_ \\ 
  | |___| | (_) | |_| | (_| | |___| | | | (_| | | | | |
   \\____|_|\\___/ \\__,_|\\__,_|\\____|_| |_|\\__,_|_|_| |_|
 
 \x1b[0m`);

 const width = process.stdout.columns;
 console.log(boxen("This project was developed by Maaz Malik. This is the first prototype to CloudChain, a truly distributed cloud service on the blockchain.",{
    padding:1,
    borderStyle:"round",
    title:"INFO",
    titleAlignment:"left",
    width:width
 }))

let identity = jsonFileInterface.read("./identity.json")

//password story
let loggedIn = false
if(!identity.password){
    console.log(boxen("Password is not set. Please set password",{
        padding:1,
        borderStyle:"round",
        borderColor:"red",
        title:"WARNING",
        titleAlignment:"left",
        width:width
     }))

    const response = await prompt({
        type:"password",
        name:"password",
        message:"Enter Password",
        prefix:"🔐"
    })

    identity["password"] = response.password
    jsonFileInterface.write("./identity.json",identity)
    loggedIn = true
}

if(!loggedIn){
    const response = await prompt({
        type:"password",
        name:"password",
        message:"Enter Password",
        prefix:"🔐"
    })

    const expectedPassword = identity.password
    const enteredPassword = response.password

    if(expectedPassword != enteredPassword){
        console.log(boxen("Password is incorrect, Exiting",{
            padding:1,
            borderStyle:"round",
            borderColor:"red",
            title:"WARNING",
            titleAlignment:"left",
            width:width
        }))

        process.exit(0)
    }
}

//password story completed

import bc from "./blockchain/blockchain.js"
import db from "./database/database.js"
import { createUbuntuSSHContainer, deleteUbuntuSSHContainer } from "./containerManager.js"

function warningBox(message){
    console.log(boxen(message,{
        padding:1,
        borderStyle:"round",
        borderColor:"red",
        title:"WARNING",
        titleAlignment:"left",
        width:width
    }))
}

function factBox(message){
    console.log(boxen(message,{
        padding:1,
        borderStyle:"round",
        borderColor:"blue",
        title:"FUN FACT",
        titleAlignment:"left",
        width:width
    }))
}

//command terminal story
const exit = false
while(exit == false){
    const response = await prompt({
        type:"input",
        name:"command",
        message:`${identity.identifier}@CloudChain : `,
        prefix:"#"
    })

    let command = response.command
    command = command.trim()
    let commandArray = shellQuote.parse(command)

    // console.log(commandArray)

    let level = 0
    try{
        if(commandArray[level] == "TRANSACT"){
            level++;
            if(commandArray[level] == "DATA"){
                level++
                const data = commandArray[level]
                const parsedData = JSON.parse(data)
                // console.log(parsedData)
                await bc.addData(parsedData)
            }else if(commandArray[level] == "INVESTMENT"){
                level++
                let amount = commandArray[level]
                amount = Number(amount)
                // console.log(amount)
                await bc.invest(amount)
            }else{
                warningBox("Command Invalid")
            }
        }else if(commandArray[level] == "SHOW"){
            level++;
            if(commandArray[level] == "BLOCKCHAIN"){
                console.log(JSON.stringify(await db.get("blockchain"),null,4))
            }else if(commandArray[level] == "PROFILES"){
                console.log(await db.get("registry"))
            }else{
                warningBox("Command Invalid")
            }
        
        }else if(commandArray[level] == "LAUNCH"){
            const totalMemory = 1024
            const registry = await db.get("registry")

            const identifier = identity.identifier
            const myOwnership = registry[identifier]["capacityWallet"]

            let totalOwnership = 0
            Object.keys(registry).map((key)=>{(
                totalOwnership += registry[key]["capacityWallet"]
            )})

            const fractionOwnership = myOwnership/totalOwnership
            const computationPower = Math.round(fractionOwnership*totalMemory)
            console.log(computationPower)

            await createUbuntuSSHContainer(computationPower, identity.identifier).then((data)=>{
                // console.log(data)
            })
        }else if(commandArray[level] == "TERMINATE"){
            await deleteUbuntuSSHContainer(identity.identifier)
        }
        else{
            warningBox("Command Invalid")
        }
    }catch(error){
        warningBox(error.message)
    }
}