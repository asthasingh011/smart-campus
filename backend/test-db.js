const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CaptureCare11",
    database: "smart_campus"
});

db.query("SELECT * FROM User", (err, results) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(results, null, 2));
    process.exit();
});
