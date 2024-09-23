import { asyncHandler } from "../utils/asyncHnadler.js";


const resisterUser=asyncHandler(async (req,res)=>{
    return res.status(200).json({
        message:"User Registered Successfully",
        data:null
    })
})


export {resisterUser}