const mysql = require('mysql2');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'CaptureCare11',
  database: 'smart_campus'
});

const dropSql = "DROP TRIGGER IF EXISTS booking_approval_notification;";
const createSql = `
CREATE TRIGGER booking_approval_notification 
AFTER UPDATE ON booking 
FOR EACH ROW 
BEGIN 
  IF NEW.Status = 'Approved' THEN 
    INSERT INTO Notification(User_ID, Message, Date_Sent, Status) 
    VALUES(NEW.User_ID, CONCAT('Your booking #', NEW.Booking_ID, ' has been approved'), CURDATE(), 'Unread'); 
  END IF; 
END;
`;

con.query(dropSql, (err) => {
  if (err) throw err;
  con.query(createSql, (err2) => {
    if (err2) throw err2;
    console.log('Trigger Updated Successfully!');
    con.end();
  });
});
