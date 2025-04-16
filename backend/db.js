const mysql = require('mysql2');

const pool = mysql.createPool({
    user:'u240298',
    host:'webcourse.cs.nuim.ie',
    database:'cs230_u240298',
    password:'phaegiePue8Eisho',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306, //mysql port
});

module.exports=pool.promise();