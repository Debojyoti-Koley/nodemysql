const mysql = require('mysql2')
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"nodemysql",
    post:3306
});

con.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        console.log("Connection created !");
    }
})

module.exports.con = con;