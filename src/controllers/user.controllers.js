import { checkEmailExistance, executeQuery } from "../db/index.js";
import { asyncHandler } from "../utils/asyncHnadler.js";

const resisterUser = asyncHandler(async (req, res) => {
  //GET USER DEATILS FROM FRONTEND
  const { userName, email, password } = req.body;

  // CHECK VALIDATION ALL FILEDS ARE REQUIRED

  console.table([userName, email, password]);
  if (!userName || !email || !password) {
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

  const query = `INSERT INTO users (userName, email, password) VALUES (?, ?, ?)`;
  const params = [userName, email, password];
  try {
    const result = await executeQuery(query, params);
    console.log("Final result is : ", result);
    return res.status(201).json({
      status: true,
      message: "User Resister Successfully!!!",
      data: {
        userDeatils: {
          id: result[0].insertId,
          userName: userName,
          email: email,
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

export { resisterUser, showUserList, showSingleUserDeatils };
