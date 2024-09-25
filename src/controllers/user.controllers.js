import { asyncHandler } from "../utils/asyncHnadler.js";


const resisterUser=asyncHandler(async (req,res)=>{
    //GET USER DEATILS FROM FRONTEND
    const {userName,email,password}=req.body;

    // CHECK VALIDATION ALL FILEDS ARE REQUIRED 

    if(!userName || !email || !password){
        return res.status(400).json({
            status:false,
            message:"Please fill in all fields",
            data:[]
        })
    }

    //CHECK EMAIL VALIDATION AND EMAIL FORATE
    const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        res.status(400).json({
            status:false,
            message:"Mail Format not Valid",
            data:[]
        })
    }

    // CHECK USER ALREADY RESISTER OR NOT 
    
    
})


export {resisterUser}