require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 DB CONNECTION
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.log("DB Connection Failed", err);
    } else {
        console.log("Connected to MySQL ✅");
    }
});

// 🧪 TEST API
app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

// 📊 GET ALL RESOURCES
app.get("/resources", (req, res) => {
    db.query("SELECT * FROM Resource", (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

// 📅 BOOK RESOURCE (✅ FIXED HERE)
app.post("/book", (req, res) => {
    console.log("BODY:", req.body); // debug

    // ✅ FIX: match PascalCase from request
    const { User_ID, Resource_ID, booking_date, start_time, end_time, purpose } = req.body;

    if (!User_ID || !Resource_ID) {
        return res.status(400).send("User_ID and Resource_ID are required.");
    }

    const sql = `
        INSERT INTO Booking 
        (User_ID, Resource_ID, booking_date, start_time, end_time, purpose, Status)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `;

    db.query(sql, [User_ID, Resource_ID, booking_date, start_time, end_time, purpose],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send(err.sqlMessage || "Booking failed");
            }
            res.send("Booking Requested ✅");
        }
    );
});


// 📝 SIGNUP
app.post("/signup", (req, res) => {
    console.log("Signup route HIT, incoming body:", req.body);
    const { Name, Email, Password, Role } = req.body;
    
    if (!Name || !Email || !Password) {
        console.warn("Signup validation failed: Missing fields");
        return res.status(400).json({ error: "Name, Email, and Password are required." });
    }

    const defaultRole = Role || 'Student';

    const checkSql = "SELECT * FROM `User` WHERE Email = ?";
    console.log(`Executing query: ${checkSql} with [${Email}]`);
    db.query(checkSql, [Email], (err, result) => {
        if (err) {
            console.error("Signup check user DB Error:", err);
            return res.status(500).json({ error: "Database error during user check.", details: err.sqlMessage });
        }
        
        if (result.length > 0) {
            console.warn(`User already exists for email: ${Email}`);
            return res.status(409).json({ error: "User already exists with this email." });
        }

        const insertSql = "INSERT INTO `User` (Name, Email, Password, Role) VALUES (?, ?, ?, ?)";
        console.log(`Executing query: ${insertSql} with [${Name}, ${Email}, ***, ${defaultRole}]`);
        db.query(insertSql, [Name, Email, Password, defaultRole], (err2, result2) => {
            if (err2) {
                console.error("Signup insert user DB Error:", err2);
                return res.status(500).json({ error: "Database error during user creation.", details: err2.sqlMessage });
            }

            console.log("Signup successful for:", Email, "New User_ID:", result2.insertId);
            res.json({
                message: "Signup successful ✅",
                user: {
                    User_ID: result2.insertId,
                    Name,
                    Email,
                    Role: defaultRole
                }
            });
        });
    });
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
    console.log("Login route HIT");
    console.log("Login Body:", req.body);
    const email = req.body.email || req.body.Email;
    const password = req.body.password || req.body.Password;

    const sql = "SELECT * FROM `User` WHERE Email = ? AND Password = ?";

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }

        if (result.length > 0) {
            res.send({
                message: "Login successful ✅",
                user: result[0]
            });
        } else {
      res.send({ success: false });        }
    });
});

// 👨‍💼 APPROVE BOOKING
app.post("/approve", (req, res) => {
    const { Booking_ID, Admin_ID } = req.body;

    console.log("BODY:", req.body);

    const updateSql = `
        UPDATE Booking 
        SET Status = 'Approved'
        WHERE Booking_ID = ?
    `;

    db.query(updateSql, [Booking_ID], (err, result) => {
        if (err) {
            console.log(err);
            return res.send(err.sqlMessage);
        }

        const insertSql = `
            INSERT INTO Approval 
            (Booking_ID, Admin_ID, Approval_Status, Approval_Date, Remarks)
            VALUES (?, ?, 'Approved', CURDATE(), 'Approved by admin')
        `;

        db.query(insertSql, [Booking_ID, Admin_ID], (err2, result2) => {
            if (err2) {
                console.log(err2);
                return res.send(err2.sqlMessage);
            }

            res.send("Booking Approved & Logged ✅");
        });
    });
});

// 📋 GET ALL BOOKINGS (JOIN)
app.get("/bookings", (req, res) => {
    const userId = req.query.userId;
    let sql = `
        SELECT 
            b.Booking_ID AS id,
            COALESCE(u.Name, 'Unknown User') AS user,
            COALESCE(r.Resource_Name, CONCAT('Resource #', b.Resource_ID)) AS resource,
            b.Booking_Date AS date,
            b.Start_Time AS start,
            b.End_Time AS end,
            b.Purpose AS purpose,
            b.Status AS status
        FROM booking b
        LEFT JOIN user u ON b.User_ID = u.User_ID
        LEFT JOIN resource r ON b.Resource_ID = r.Resource_ID
    `;
    let params = [];
    
    if (userId) {
        sql += ` WHERE b.User_ID = ? ORDER BY b.Booking_ID DESC LIMIT 1`;
        params.push(userId);
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

// 🔍 GET SINGLE BOOKING
app.get("/bookings/:id", (req, res) => {
    const bookingId = req.params.id;
    const sql = `
        SELECT 
            b.Booking_ID AS id,
            COALESCE(u.Name, 'Unknown User') AS user,
            COALESCE(r.Resource_Name, CONCAT('Resource #', b.Resource_ID)) AS resource,
            b.Booking_Date AS date,
            b.Start_Time AS start,
            b.End_Time AS end,
            b.Purpose AS purpose,
            b.Status AS status
        FROM booking b
        LEFT JOIN user u ON b.User_ID = u.User_ID
        LEFT JOIN resource r ON b.Resource_ID = r.Resource_ID
        WHERE b.Booking_ID = ?
    `;

    db.query(sql, [bookingId], (err, result) => {
        if (err) {
            console.error("Database error fetching booking:", err);
            return res.status(500).json({ error: "Database error fetching booking", details: err.sqlMessage || err });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(result[0]);
    });
});

// 🗑️ DELETE BOOKING
app.delete("/bookings/:id", (req, res) => {
    const bookingId = req.params.id;

    // Delete related records first to avoid foreign key constraints
    db.query("DELETE FROM approval WHERE Booking_ID = ?", [bookingId], () => {
        db.query("DELETE FROM usage_log WHERE Booking_ID = ?", [bookingId], () => {
            db.query("DELETE FROM schedule_slot WHERE Booking_ID = ?", [bookingId], () => {
                db.query("DELETE FROM booking WHERE Booking_ID = ?", [bookingId], (err, result) => {
                    if (err) {
                        console.error("Delete error:", err);
                        return res.status(500).send(err);
                    }
                    res.send({ success: true, message: "Booking Deleted 🗑️" });
                });
            });
        });
    });
});

// 👤 GET MY BOOKINGS
app.get("/my-bookings/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT 
            b.Booking_ID AS id,
            COALESCE(u.Name, 'Unknown User') AS user,
            COALESCE(r.Resource_Name, CONCAT('Resource #', b.Resource_ID)) AS resource,
            b.Booking_Date AS date,
            b.Start_Time AS start,
            b.End_Time AS end,
            b.Purpose AS purpose,
            b.Status AS status
        FROM booking b
        LEFT JOIN user u ON b.User_ID = u.User_ID
        LEFT JOIN resource r ON b.Resource_ID = r.Resource_ID
        WHERE b.User_ID = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

// 🔔 GET NOTIFICATIONS
app.get("/notifications/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT * FROM notification
        WHERE User_ID = ?
    `;

    db.query(sql, [userId], (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

// ✔ MARK NOTIFICATION AS READ
app.patch("/notifications/:id/read", (req, res) => {
    const notifId = req.params.id;
    const sql = `UPDATE notification SET Status = 'Read' WHERE Notification_ID = ?`;

    db.query(sql, [notifId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ success: true, message: "Marked as read" });
    });
});

// ❌ REJECT BOOKING
app.post("/reject", (req, res) => {
    const { Booking_ID, Admin_ID } = req.body;

    const updateSql = `
        UPDATE booking 
        SET Status = 'Rejected'
        WHERE Booking_ID = ?
    `;

    db.query(updateSql, [Booking_ID], (err) => {
        if (err) return res.send(err);

        const insertSql = `
            INSERT INTO approval 
            (Booking_ID, Admin_ID, Approval_Status, Approval_Date, Remarks)
            VALUES (?, ?, 'Rejected', CURDATE(), 'Rejected by admin')
        `;

        db.query(insertSql, [Booking_ID, Admin_ID], (err2) => {
            if (err2) return res.send(err2);

            res.send("Booking Rejected ❌");
        });
    });
});
app.post("/maintenance", (req, res) => {
    const { Resource_ID, Issue_Description, Reported_Date, Status } = req.body;

    const sql = `
        INSERT INTO Maintenance 
        (Resource_ID, Issue_Description, Reported_Date, Status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [Resource_ID, Issue_Description, Reported_Date, Status],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send(err.sqlMessage);
            }
            res.send("Maintenance Added 🔧");
        }
    );
});
app.post("/notification", (req, res) => {
    const { User_ID, Message, Date_Sent, Status } = req.body;

    const sql = `
        INSERT INTO Notification
        (User_ID, Message, Date_Sent, Status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [User_ID, Message, Date_Sent, Status],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Notification Sent 🔔");
        }
    );
});
// 📦 GET ALL RESOURCE TYPES
app.get("/resource-types", (req, res) => {
    const sql = "SELECT * FROM resource_type";

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});
// 📊 GET USAGE LOGS
app.get("/usage-logs", (req, res) => {
    const sql = `
        SELECT 
            ul.Log_ID AS id,
            r.Resource_Name AS resource,
            u.Name AS user,
            b.Booking_Date AS date,
            ul.Actual_Start_Time AS start,
            ul.Actual_End_Time AS end,
            ul.Remarks AS purpose
        FROM usage_log ul
        LEFT JOIN booking b ON ul.Booking_ID = b.Booking_ID
        LEFT JOIN user u ON b.User_ID = u.User_ID
        LEFT JOIN resource r ON b.Resource_ID = r.Resource_ID
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});
// ➕ ADD USAGE LOG
app.post("/usage-log", (req, res) => {
    const { Booking_ID, Actual_Start_Time, Actual_End_Time, Remarks } = req.body;

    const sql = `
        INSERT INTO usage_log
        (Booking_ID, Actual_Start_Time, Actual_End_Time, Remarks)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [Booking_ID, Actual_Start_Time, Actual_End_Time, Remarks],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Usage log added ✅");
        }
    );
});
// ⏱️ GET SCHEDULE SLOTS
app.get("/slots", (req, res) => {
    const sql = "SELECT * FROM schedule_slot";

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});
// ➕ ADD SLOT
app.post("/slot", (req, res) => {
    const { Booking_ID, Slot_Start_Time, Slot_End_Time } = req.body;

    const sql = `
        INSERT INTO schedule_slot
        (Booking_ID, Slot_Start_Time, Slot_End_Time)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [Booking_ID, Slot_Start_Time, Slot_End_Time],
        (err, result) => {
            if (err) return res.send(err);
            res.send("Slot added ✅");
        }
    );
});

// 📈 GET USAGE ANALYTICS
app.get("/analytics", (req, res) => {
    console.log("Analytics route HIT");
    const { role, userId } = req.query;

    let baseCondition = "";
    let baseParams = [];
    if (role && role !== 'Admin' && userId) {
        baseCondition = "WHERE b.User_ID = ?";
        baseParams = [userId];
    }

    const q1 = `
        SELECT b.Resource_ID as resource_id, r.Resource_Name, COUNT(*) AS total_bookings 
        FROM booking b 
        JOIN resource r ON b.Resource_ID = r.Resource_ID
        ${baseCondition}
        GROUP BY b.Resource_ID, r.Resource_Name 
        ORDER BY total_bookings DESC 
        LIMIT 5
    `;

    const q2 = `
        SELECT b.Resource_ID as resource_id, r.Resource_Name, COUNT(*) AS count 
        FROM booking b 
        JOIN resource r ON b.Resource_ID = r.Resource_ID
        ${baseCondition}
        GROUP BY b.Resource_ID, r.Resource_Name
    `;

    const q3 = `
        SELECT HOUR(b.start_time) AS hour, COUNT(*) AS total 
        FROM booking b 
        ${baseCondition}
        GROUP BY hour 
        ORDER BY total DESC 
        LIMIT 5
    `;

    db.query(q1, baseParams, (err1, mostUsedResources) => {
        if (err1) return res.status(500).send(err1);
        
        db.query(q2, baseParams, (err2, bookingsPerResource) => {
            if (err2) return res.status(500).send(err2);
            
            db.query(q3, baseParams, (err3, peakHours) => {
                if (err3) return res.status(500).send(err3);
                
                res.json({
                    mostUsedResources,
                    bookingsPerResource,
                    peakHours
                });
            });
        });
    });
});

// ▶️ START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});