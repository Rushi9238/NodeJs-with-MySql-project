// const mysql=require('mysql2')
// const app =require('express')

import dotenv from 'dotenv'
import { connectDB } from './db/index.js'
import {app} from './app.js'
dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{

    app.listen(8000,()=>{
        console.log("Server is running on port 8000");
    })
})
.catch((error)=>{
    console.error("MySQL connection failed :",error);
    process.exit(1);  // Exit process in case of connection failure
})

// Global Error Hnadeler for app
app.on("error",(error)=>{
    console.error("Error occurred when starting the app :",error);
})





















// const connectionSQL=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'crud_db'

// })
// connectionSQL.connect((error)=>{
// if(error){
//     console.log("Error connection to the SQL :",error.message);
// }else{
//     console.log("Connection to SQL successful");
// }
// })

