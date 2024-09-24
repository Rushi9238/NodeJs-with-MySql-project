import { asyncHandler } from "../utils/asyncHnadler.js";


const resisterUser=asyncHandler(async (req,res)=>{
    const {name}=req.body;
    console.log("body",name);
})


export {resisterUser}