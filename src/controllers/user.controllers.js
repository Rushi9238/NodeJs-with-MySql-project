// import { status } from "express/lib/response.js";
import { checkEmailExistance, connectDB, executeQuery } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHnadler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createPasswordIntoHash = async (password) => {
  const saltRound = 10;
  try {
    const salt = await bcrypt.genSalt(saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (error) {
    console.error("Error comes when create password in hash :", error);
  }
};

const checkIsPasswordCorrect=async(password,hashedPassword)=>{
  try {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    return isPasswordCorrect;
    
  } catch (error) {
    console.error("Error comes when checking the hashed passwod and password :",error)
    return false;
  }
}

const generateAccessToken =async(userId)=>{
  return jwt.sign(
    {
      id:userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

const generateRefreshToken =async(userId)=>{
  return jwt.sign(
    {
      id:userId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

const generateAccessAndRefreshToken=async(userId)=>{
  const accessToken=await generateAccessToken(userId)
  const refreshToken=await generateRefreshToken(userId)

  return {accessToken,refreshToken}

}

const resisterUser = asyncHandler(async (req, res) => {
  //GET USER DEATILS FROM FRONTEND
  const { userName, email, password, userRole } = req.body;

  // CHECK VALIDATION ALL FILEDS ARE REQUIRED

  console.table([userName, email, password, userRole]);
  if (!userName || !email || !password || !userRole) {
    return res.status(400).json({
      status: false,
      message: "Please fill in all fields",
      data: {},
    });
  }

  //CHECK EMAIL VALIDATION AND EMAIL FORATE
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      status: false,
      message: "Mail Format not Valid",
      data: {},
    });
  }

  // CHECK USER ALREADY RESISTER OR NOT
  const checkEmailAlreadyResister = await checkEmailExistance(email);
  console.log("checkEmailAlreadyResister", checkEmailAlreadyResister);
  if (checkEmailAlreadyResister) {
    return res.status(400).json({
      status: false,
      message: "Email already resister",
      data: {},
    });
  }

  // convert Password into bycrpt 
  const hashedPassword= await createPasswordIntoHash(password)

  const query = `INSERT INTO users (userName, email, password, userRole) VALUES (?, ?, ?, ?)`;
  const params = [userName, email, hashedPassword, userRole];
  try {
    const result = await executeQuery(query, params);
    // console.log("Final result is : ", result);
    return res.status(201).json({
      status: true,
      message: "User Resister Successfully!!!",
      data: {
        userDeatils: {
          id: result[0].insertId,
          userName: userName,
          email: email,
          userRole,
        },
      },
    });
  } catch (error) {
    console.error("Error comes when data inserting into dataBase :", error);
    return res.status(500).json({
      status: false,
      message: "Error comes when data inserting into dataBase ",
      data: {},
    });
  }
});

const showUserList = asyncHandler(async (req, res) => {
  const sql = `SELECT id,userName,email FROM users`;
  const result = await executeQuery(sql, []);
  console.log("result :,", result);
  if (result[0].length > 0) {
    return res.status(200).json({
      status: true,
      message: "User deatils list",
      data: {
        userList: [...result[0]],
      },
    });
  } else {
    return res.status(404).json({
      status: false,
      message: "User list is empty",
      data: {
        userList: [],
      },
    });
  }
});

const showSingleUserDeatils = asyncHandler(async (req, res) => {
  console.log("User id, ", req.query);
  const { userId } = req.query;
  if (userId == undefined) {
    return res.status(404).json({
      status: false,
      message: "User id is required",
      data: {},
    });
  }
  const sql = `SELECT id, userName,email FROM users WHERE id=?`;
  const param = [userId];
  // return
  try {
    const result = await executeQuery(sql, param);
    // console.log("result :",result[0][0])
    if (result[0].length > 0) {
      return res.status(201).json({
        status: true,
        message: "User deatils found",
        data: {
          userDetails: {
            ...result[0][0],
          },
        },
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "User Not Found",
        data: {},
      });
    }
  } catch (error) {
    console.error("Error comes when get single API call, ", error);
  }
});

const userLogin=asyncHandler(async(req,res)=>{
    //get deatils user mail and password
    const {email,password}=req.body
    //check mail and password coming or not
    if(!email && !password){
        return res.status(404).json({
            status:false,
            message:"All fileds are required!",
            data:{}
        })
    }
    // Check user are exixst or not in database
    const emailExistesOrNot=await checkEmailExistance(email)
    // console.log('emailExistesOrNot',emailExistesOrNot)
    if(!emailExistesOrNot){
        return res.status(400).json({
            status:false,
            message:"User not resister, please do first resister",
            data:{}
        })
    }
    //check password and database hashed password are correct or not
    const sql=`SELECT id, userName, password FROM users WHERE email=?`;
    const param=[email];
    let chechuserPasswordAndHashPassword=false;
    let result
    try {
       result=await executeQuery(sql,param)
      if(result[0].length>0){
        chechuserPasswordAndHashPassword= await checkIsPasswordCorrect(password,result[0][0]?.password)
        // console.log("Result is",chechuserPasswordAndHashPassword)

      }else{
        return res.status(500).json({
          status:false,
          message:"Something went Wrong please try again",
          data:{}
        })
      }
    } catch (error) {
      console.error("error comes when user login",error)
    }
    if(!chechuserPasswordAndHashPassword){
      return res.status(400).json({
        status:false,
        message:"Password is incorrect",
        data:{}
      })
    }
    //create token 
    //accsess secret is u8tJIXi37BmiaKDx1o461MSfY3fMoXHIDP8u1yqUfZKPj3FBbL
    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(result[0][0]?.id)
    // console.table([accessToken,refreshToken])
    
    // send token and user deatils 
})

export { resisterUser, showUserList, showSingleUserDeatils,userLogin };
