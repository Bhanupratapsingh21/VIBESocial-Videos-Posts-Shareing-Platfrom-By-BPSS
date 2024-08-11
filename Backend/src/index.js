import dotenv from 'dotenv'
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: "./env"
})

// 2nd approch with db index.js then =>

connectDB()
    .then(() => {

        app.on("error", (error) => {
            console.log("error not able to listin", error);
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server iS Running At Port ${process.env.PORT}`)
        })
    })
    .catch(
        (err) => {
            console.log("moogoDb connenation failed !! ::", err)
        })












/*
//require('dotenv').config({path : "./env"})
// always use try catch and promises in db so you will be able to handle error or use async await for it also
import express from 'express'
const app = express()


( async ()=>{
    try {
        
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error not able to listin",error);

        })
        app.listen(process.env.PORT , ()=>{
            console.log(`App is listening on Port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log( "Error", error)

    }
})()*/
