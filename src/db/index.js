import mysql from "mysql2/promise";

// const sqlConnection=mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'crud_db'
// })

/* 
        **** Why use mysql.promies***
For Modern JavaScript Development: Use import mysql from 'mysql2/promise';. 
The promise-based version is easier to manage, especially when dealing with multiple 
asynchronous database operations. It works seamlessly with async/await, improving 
readability and error handling.

For Legacy Code: If you're maintaining older code that relies heavily on callbacks, 
or if you're working in an environment where promises are not supported, you might 
stick with mysql2.

Since you're working with modern JavaScript (Node.js, async/await), 
the promise-based version (mysql2/promise) is the better choice.

*/

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "crud_db",
    });
    console.log("Connected to database");
    return connection;
  } catch (error) {
    console.log("Error comes when connection failed : ", error);
    process.exit(1);  // Exit process in case of connection failure
  }
};

const checkEmailExistance=async(email)=>{
  try {
    const connection= await connectDB();
    const query ='SELECT * FROM users WHERE email= ?'
    // const result=await connection.execute(query,[email])
    const [results] = await connection.execute(query, [email]);
    console.log("result from check email existance function :",results);
    return results.length > 0;
  } catch (error) {
    console.error("Error checking email existence function :",error)
    return false;
  }
}

const executeQuery=async(sql,params)=>{
  try {
    const connection= await connectDB();
    return await connection.query(sql,params)
    
  } catch (error) {
    console.error("Error comes when query execte time :",error)
  }
}

export { connectDB , checkEmailExistance, executeQuery};
