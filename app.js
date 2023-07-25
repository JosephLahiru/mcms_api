const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, 'YouTookMyHeartAwayWhenMyWholeWorldWasGray', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      req.user = user;
      next();
    });
  };

const endpoints = {
    "Request Token": '/request_token',
    "Root": '/', 
    "Get Doctors": '/get_doctors', 
    "Get Channelling Doctors": '/get_channelling_doctors',
    "Get Doctors By ID": '/get_doctors/:d_id',
    "Set Doctors": '/set_doctors',
    "Get Patients": '/get_patients',
    "Get Patients By NIC": '/get_patients/:nic',
    "Set Patients": '/set_patients',
    "Get Profit": '/get_profit',
    "Get Profit By Date": '/get_profit/:date',
    "Get Weekly Profit": '/get_weekly_profit/:date',
    "Get Monthly Profit": '/get_monthly_profit/:date',
    "Set Profit": '/set_profit',
    "Get Attendance": '/get_attendance',
    "Get Attendance By ID": '/get_attendance/:assit_id',
    "Get Attendance By Date": '/get_attendance/:date',
    "Get Attendance By ID and Date": '/get_attendance/:assit_id/:date',
    "Set Attendance": '/set_attendance',
    "Get Appointment": '/get_appointment',
    "Delete Appointment By Appo ID": '/delete_appointment/:appo_id',
    "Get Appointment By App ID": '/get_appointment/:appo_id',
    "Set Appointment": '/set_appointment',
    "Update Appoinment By App ID": '/update_appointment/:app_id',
    "Get Notification": '/get_notification',
    "Set Notification": '/set_notification',
    "Get Stock": '/get_stock',
    "Get Stock By Prod ID": '/get_stock/:prdct_id',
    "Set Stock": '/set_stock',
    "Delete Stock By Prod ID": '/delete_stock/:prdct_id',
    "Get Patient History": '/get_patient_history',
    "Set Patient History": '/set_patient_history',
    "Get Expire": '/get_expire',
    "Get Expire By Expire Type": '/get_expire/:expire_type',
    "Get Stock Low By Stock Type": '/get_stock_low/:stock_type',
    "Get Stock Low": '/get_stock_low',
    "Set Ping": '/set_ping',
    "Get Med Types": '/get_med_types',
    "Get Appointment ID By Appointment Name": '/get_app_id/:at_name',
    "Get Channelling Doctor ID By Doctor Type": '/get_cd_id/:d_type',
    "Get ATM ID By ATM Type": '/get_atm_id/:atm_type',
    "Get Stock Type ID By Stock Type": '/get_stock_type_id/:stock_type',
    "Get Expire Type ID By Expire Type": '/get_expire_type_id/:expire_type',
    "Get Stock Types": '/get_stock_types',
    "Get Expire Types": '/get_expire_types',
    "Get Returning And None": "/get_returning_none",
    "Set Billing": "/set_billing",
    "Update Stock By Product ID": "/update_stock/:prdct_id",
    "Update Seen Status": '/update_seen_status',
    "Get Seen Count": '/get_seen_count',
    "Get Doctor Names": '/get_doctor_names',
    "Get Current App Num": '/get_curr_app_num/:curr_date/:cd_id',
    "Get User Details": '/get_user_details',
    "Authenticate User": '/user_authenticate',
    "Get Assistants": '/get_assistants',
    "Confirm Appointment Payment By Appo ID": '/confirm_app_payment/:appo_id',
    "Get Personal Titles": '/get_personal_titles',
    "Get Latest Appointment ID": '/get_lat_app_id',
    "Update Channelling Doctor By Channelling Doctor ID": '/update_channelling_doctor/:cd_id',
    "Delete Channelling Doctor By Channelling Doctor ID": '/get_channelling_doctors/:cd_id',
    "Set Channelling Doctor": '/set_channelling_doctor',
    "Get Appointment Number": '/get_app_no',
    "Set Appointment Number": '/set_app_no/:app_no',
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

const users = [
    { id: 1, username: 'admin', password: 'adminpwd@1234!' },
    { id: 2, username: 'joe', password: 'joepwd@1234!' },
  ];

app.post(endpoints["Request Token"], (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find((u) => u.username === username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  
    const token = jwt.sign(user, 'YouTookMyHeartAwayWhenMyWholeWorldWasGray');

    res.json({ token });
});
  

//Online Test
app.get(endpoints["Root"], (req, res) => {
    res.send('<center><h1>Hi!, I am Online!!!</h1></center>');
});

//Get Endpoints
app.get('/get_endpoints', (req, res) => {
    res.send(endpoints);
});

//Get Doctors
app.get(endpoints["Get Doctors"], (req, res) => {
    const sql = 'SELECT * FROM doctor WHERE deleted = 0';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Channelling Doctors
app.get(endpoints["Get Channelling Doctors"], (req, res) => {
    const sql = 'SELECT * FROM channelling_doctor';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Doctors By ID
app.get(endpoints["Get Doctors By ID"], (req, res) => {
    const d_id = req.params.d_id;
    const d_idRegex = /^D\d{3}$/;
    if (!d_idRegex.test(d_id)) {
        res.status(400).json({ error: 'Invalid doctor ID format.' });
        return;
    }
    const sql = 'SELECT * FROM doctor WHERE d_id = ? AND deleted = 0';
    db.query(sql, [d_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Doctors
app.post(endpoints["Set Doctors"], (req, res) => {
    const { d_id, first_name, last_name, nic, email, address, contact_no } = req.body;
    const sql = 'INSERT INTO doctor (d_id, first_name, last_name, nic, email, address, contact_no) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [d_id, first_name, last_name, nic, email, address, contact_no], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Doctor added successfully.' });
    });
});

//Get Patients
app.get(endpoints["Get Patients"], (req, res) => {
    const sql = 'SELECT * FROM patient';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Patients By NIC
app.get(endpoints["Get Patients By NIC"], (req, res) => {
    const nic = req.params.nic;
    const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
    if (!nicRegex.test(nic)) {
        res.status(400).json({ error: 'Invalid NIC format.' });
        return;
    }
    const sql = 'SELECT * FROM patient WHERE nic = ?';
    db.query(sql, [nic], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Patients
app.post(endpoints["Set Patients"], (req, res) => {
    const { first_name, last_name, nic, age, p_type, gender, app_date, contact_no, address } = req.body;
    const sql = 'INSERT INTO patient (first_name, last_name, nic, age, p_type, gender, app_date, contact_no, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [first_name, last_name, nic, age, p_type, gender, app_date, contact_no, address], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Patient added successfully.' });
    });
});

//Get Profit
app.get(endpoints["Get Profit"], (req, res) => {
    const sql = 'SELECT * FROM profit';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Profit By Date
app.get(endpoints["Get Profit By Date"], (req, res) => {
    const date = req.params.date;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ error: 'Invalid date format.' });
        return;
    }
    const sql = 'SELECT * FROM profit WHERE date = ?';
    db.query(sql, [date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Weekly Profit
app.get(endpoints["Get Weekly Profit"], (req, res) => {
    const date = req.params.date;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ error: 'Invalid date format.' });
        return;
    }
    const sql = "SELECT SUM(CAST(selling_cost_free_med AS DECIMAL(20,2))) AS selling_cost_free_med, SUM(CAST(actual_cost_free_med AS DECIMAL(20,2))) AS actual_cost_free_med, SUM(CAST(selling_cost_issued_med AS DECIMAL(20,2))) AS selling_cost_issued_med, SUM(CAST(actual_cost_issued_med AS DECIMAL(20,2))) AS actual_cost_issued_med, SUM(CAST(daily_profit AS DECIMAL(20,2))) AS total_profit FROM profit WHERE date BETWEEN DATE_SUB(?, INTERVAL 6 DAY) AND ?;";
    db.query(sql, [date, date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Monthly Profit
app.get(endpoints["Get Monthly Profit"], (req, res) => {
    const date = req.params.date;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ error: 'Invalid date format.' });
        return;
    }
    const sql = "SELECT SUM(CAST(selling_cost_free_med AS DECIMAL(20,2))) AS selling_cost_free_med, SUM(CAST(actual_cost_free_med AS DECIMAL(20,2))) AS actual_cost_free_med, SUM(CAST(selling_cost_issued_med AS DECIMAL(20,2))) AS selling_cost_issued_med, SUM(CAST(actual_cost_issued_med AS DECIMAL(20,2))) AS actual_cost_issued_med, SUM(CAST(daily_profit AS DECIMAL(20,2))) AS total_profit FROM profit WHERE date BETWEEN DATE_SUB(?, INTERVAL 29 DAY) AND ?;";
    db.query(sql, [date, date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Profit
app.post(endpoints["Set Profit"], (req, res) => {
    const { date, selling_cost_free_med, actual_cost_free_med, selling_cost_issued_med, actual_cost_issued_med, daily_profit } = req.body;
    const sql = 'INSERT INTO profit (date, selling_cost_free_med, actual_cost_free_med, selling_cost_issued_med, actual_cost_issued_med, daily_profit) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [date, selling_cost_free_med, actual_cost_free_med, selling_cost_issued_med, actual_cost_issued_med, daily_profit], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Profit added successfully.' });
    });
});

//Get Attendance
app.get(endpoints["Get Attendance"], (req, res) => {
    const sql = 'SELECT * FROM attendance';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Attendance By ID
app.get(endpoints["Get Attendance By ID"], (req, res) => {
    const assit_id = req.params.assit_id;
    const assit_idRegex = /^A\d{3}$/;
    if (!assit_idRegex.test(assit_id)) {
        res.status(400).json({ error: 'Invalid Assitant ID format.' });
        return;
    }
    const sql = 'SELECT * FROM attendance WHERE assit_id = ?';
    db.query(sql, [assit_id, date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Attendance By Date
app.get(endpoints["Get Attendance By Date"], (req, res) => {
    const date = req.params.date;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ error: 'Invalid Assitant ID format.' });
        return;
    }
    const sql = 'SELECT * FROM attendance WHERE date = ?';
    db.query(sql, [date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Attendance By ID and Date
app.get(endpoints["Get Attendance By ID and Date"], (req, res) => {
    const assit_id = req.params.assit_id;
    const date = req.params.date;
    const assit_idRegex = /^A\d{3}$/;
    if (!assit_idRegex.test(assit_id)) {
        res.status(400).json({ error: 'Invalid Assitant ID format.' });
        return;
    }
    const sql = 'SELECT * FROM attendance WHERE assit_id = ? AND date = ?';
    db.query(sql, [assit_id, date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Attendance
app.post(endpoints["Set Attendance"], (req, res) => {
    const { assit_id, date, check_in, check_out, leave } = req.body;
    const sql = 'INSERT INTO attendance (assit_id, date, check_in, check_out, leave) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [assit_id, date, check_in, check_out, leave], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Attendance added successfully.' });
    });
});

//Get Appointment
app.get(endpoints["Get Appointment"], (req, res) => {
    const sql = 'SELECT * FROM appointment WHERE deleted = 0';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Delete Appointment By Appo ID
app.get(endpoints["Delete Appointment By Appo ID"], (req, res) => {
    const appo_id = req.params.appo_id;
    const appo_idRegex = /^(?:[1-9]|[1-9]\d{1,2}|999)$/;
    if (!appo_idRegex.test(appo_id)) {
        res.status(400).json({ error: 'Invalid Appointment ID format.' });
        return;
    }
    const sql = 'UPDATE appointment SET deleted = 1 WHERE app_id = ?';
    db.query(sql, [appo_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Appointment By App ID
app.get(endpoints["Get Appointment By App ID"], (req, res) => {
    const appo_id = req.params.appo_id;
    const appo_idRegex = /^(?:[1-9]|[1-9]\d{1,2}|999)$/;
    if (!appo_idRegex.test(appo_id)) {
        res.status(400).json({ error: 'Invalid Appoinment Number format.' });
        return;
    }
    const sql = 'SELECT * FROM appointment WHERE deleted = 0 AND app_id = ?';
    db.query(sql, [appo_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Appointment
app.post(endpoints["Set Appointment"], (req, res) => {
    const { patient_name, area, age, gender, mobile, cd_id, app_date, app_num, nic, title_id } = req.body;
    const sql = 'INSERT INTO appointment (patient_name, area, age, gender, mobile, cd_id, app_date, app_num, nic, title_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [patient_name, area, age, gender, mobile, cd_id, app_date, app_num, nic, title_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Appointment added successfully.' });
    });
});

// Update Appoinment By App ID
app.post(endpoints["Update Appoinment By App ID"], (req, res) => {
    const { patient_name, area, age, gender, mobile, nic, title_id } = req.body;
    const appointmentId = req.params.app_id;
    const sql = 'UPDATE appointment SET patient_name=?, area=?, age=?, gender=?, mobile=?, nic=?, title_id=? WHERE app_id=?';
    db.query(sql, [patient_name, area, age, gender, mobile, nic, title_id, appointmentId], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Appointment updated successfully.' });
    });
});

//Get Notification
app.get(endpoints["Get Notification"], (req, res) => {
    const sql = 'SELECT * FROM notification';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Notification
app.post(endpoints["Set Notification"], (req, res) => {
    const { body, category, description } = req.body;
    const sql = 'INSERT INTO notification (body, category, description) VALUES (?, ?, ?)';
    db.query(sql, [body, category, description], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Notification added successfully.' });
    });
});

//Get Stock
app.get(endpoints["Get Stock"], (req, res) => {
    const sql = 'SELECT * FROM stock WHERE deleted = 0';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Stock By Prod ID
app.get(endpoints["Get Stock By Prod ID"], (req, res) => {
    const prdct_id = req.params.prdct_id;
    const prdct_idRegex = /^(?:[1-9]|[1-9]\d{1,2}|999)$/;
    if (!prdct_idRegex.test(prdct_id)) {
        res.status(400).json({ error: 'Invalid Product ID format.' });
        return;
    }
    const sql = 'SELECT * FROM stock WHERE prdct_id = ? AND deleted = 0';
    db.query(sql, [prdct_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Stock
app.post(endpoints["Set Stock"], (req, res) => {
    const { brand_name, prdct_name, description, mfd_date, exp_date, ac_price, sell_price, total_quantity, med_type, stock_type, purchased_date } = req.body;

    const days_to_expire = Math.abs(new Date(exp_date) - new Date(purchased_date)) / (1000 * 60 * 60 * 24);

    let _expire_type = 0

    if(days_to_expire > 0 && days_to_expire <= 30){
        _expire_type = 1
    }else if(days_to_expire > 30 && days_to_expire <= 60){
        _expire_type = 2
    }else if(days_to_expire < 60){
        _expire_type = 3
    }

    const expire_type = _expire_type;

    const sql = 'INSERT INTO stock (brand_name, prdct_name, description, mfd_date, exp_date, ac_price, sell_price, total_quantity, med_type, stock_type, expire_type, purchased_date ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [brand_name, prdct_name, description, mfd_date, exp_date, ac_price, sell_price, total_quantity, med_type, stock_type, expire_type, purchased_date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Stock added successfully.' });
    });
});

//Delete Stock By Prod ID
app.get(endpoints["Delete Stock By Prod ID"], (req, res) => {
    const prdct_id = req.params.prdct_id;
    const prdct_idRegex = /^(?:[1-9]|[1-9]\d{1,2}|999)$/;
    if (!prdct_idRegex.test(prdct_id)) {
        res.status(400).json({ error: 'Invalid Product ID format.' });
        return;
    }
    const sql = 'UPDATE stock SET deleted = 1 WHERE prdct_id = ?';
    db.query(sql, [prdct_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Patient History
app.get(endpoints["Get Patient History"], (req, res) => {
    const sql = 'SELECT * FROM patient_history';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Patient History
app.post(endpoints["Set Patient History"], (req, res) => {
    const { nic, first_name, last_name, app_doctor, app_type, app_date, app_time } = req.body;
    const sql = 'INSERT INTO stock (nic, first_name, last_name, app_doctor, app_type, app_date, app_time) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nic, first_name, last_name, app_doctor, app_type, app_date, app_time], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Patient setted successfully.' });
    });
});

//Get Expire
app.get(endpoints["Get Expire"], (req, res) => {
    const sql = 'SELECT * FROM expire';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Expire By Expire Type
app.get(endpoints["Get Expire By Expire Type"], (req, res) => {
    const _type = req.params.expire_type;
    const _typeRegex = /^[1-9]$/;
    if (!_typeRegex.test(_type)) {
        res.status(400).json({ error: 'Invalid Expire Type format.' });
        return;
    }
    const sql = 'SELECT * FROM expire WHERE expire_type = ?';
    db.query(sql, [_type], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Stock Low By Stock Type
app.get(endpoints["Get Stock Low By Stock Type"], (req, res) => {
    const stock_type = req.params.stock_type;
    const stock_typeRegex = /^[1-9]$/;
    if (!stock_typeRegex.test(stock_type)) {
        res.status(400).json({ error: 'Invalid Stock Type format.' });
        return;
    }
    const sql = 'SELECT * FROM stock_low WHERE stock_type = ?';
    db.query(sql, [stock_type], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Stock Low
app.get(endpoints["Get Stock Low"], (req, res) => {
    const sql = 'SELECT * FROM stock_low';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Ping
app.post(endpoints["Set Ping"], (req, res) => {
    const { data } = req.body;
    const sql = 'INSERT INTO ping (data) VALUES (?)';
    db.query(sql, [data], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Pingged successfully.' });
    });
});

//Get Med Types
app.get(endpoints["Get Med Types"], (req, res) => {
    const sql = 'SELECT DISTINCT med_type FROM stock;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Appointment ID By Appointment Name
app.get(endpoints["Get Appointment ID By Appointment Name"], (req, res) => {
    const app_name = req.params.at_name;
    if (!app_name === '') {
        res.status(400).json({ error: 'Appointment Name cannot be empty.' });
        return;
    }
    const sql = 'SELECT at_id FROM appointment_type WHERE at_name = ?;';
    db.query(sql, [app_name], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Channelling Doctor ID By Doctor Type
app.get(endpoints["Get Channelling Doctor ID By Doctor Type"], (req, res) => {
    const d_type = req.params.d_type;
    if (!d_type === '') {
        res.status(400).json({ error: 'Doctor Type cannot be empty.' });
        return;
    }
    const sql = 'SELECT cd_id FROM channelling_doctor WHERE d_type = ?;';
    db.query(sql, [d_type], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get ATM ID By ATM Type
app.get(endpoints["Get ATM ID By ATM Type"], (req, res) => {
    const atm_type = req.params.atm_type;
    if (!atm_type === '') {
        res.status(400).json({ error: 'ATM Type cannot be empty.' });
        return;
    }
    const sql = 'SELECT atm_id FROM appointment_time WHERE atm_type = ?;';
    db.query(sql, [atm_type], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Stock Type ID By Stock Type
app.get(endpoints["Get Stock Type ID By Stock Type"], (req, res) => {
    const stock_type = req.params.stock_type;
    if (!stock_type === '') {
        res.status(400).json({ error: 'Stock Type cannot be empty.' });
        return;
    }
    const sql = 'SELECT stock_type_id FROM stock_type WHERE stock_type = ?;';
    db.query(sql, [stock_type], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Expire Type ID By Expire Type
app.get(endpoints["Get Expire Type ID By Expire Type"], (req, res) => {
    const expire_type = req.params.expire_type;
    if (!expire_type === '') {
        res.status(400).json({ error: 'Expire Type cannot be empty.' });
        return;
    }
    const sql = 'SELECT expire_type_id FROM expire_type WHERE expire_type = ?;';
    db.query(sql, [expire_type], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Returning And None
app.get(endpoints["Get Returning And None"], (req, res) => {
    const sql = 'SELECT * FROM returning_and_none;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Billing
app.post(endpoints["Set Billing"], (req, res) => {
    const { inv_date, app_num, selected_doctor, doctor_charge, drug_name, drug_id, quantity, unit_price, discount, total_amount } = req.body;
    const sql = 'INSERT INTO billing (inv_date, app_num, selected_doctor, doctor_charge, drug_name, drug_id, quantity, unit_price, discount, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [inv_date, app_num, selected_doctor, doctor_charge, drug_name, drug_id, quantity, unit_price, discount, total_amount], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Billing added successfully.' });
    });
});

//Get Stock Types
app.get(endpoints["Get Stock Types"], (req, res) => {
    const sql = 'SELECT DISTINCT stock_type FROM stock_type;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Expire Types
app.get(endpoints["Get Expire Types"], (req, res) => {
    const sql = 'SELECT DISTINCT expire_type FROM expire_type;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

// Update Stock By Product ID
app.post(endpoints["Update Stock By Product ID"], (req, res) => {
    const { brand_name, prdct_name, mfd_date, exp_date, ac_price, sell_price, med_type, stock_type, expire_type } = req.body;
    const _prdct_id = req.params.prdct_id;
    const sql = 'UPDATE stock SET brand_name=?, prdct_name=?, mfd_date=?, exp_date=?, ac_price=?, sell_price=?, med_type=?, stock_type=?, expire_type=? WHERE prdct_id=?';
    db.query(sql, [brand_name, prdct_name, mfd_date, exp_date, ac_price, sell_price, med_type, stock_type, expire_type, _prdct_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Stock updated successfully.' });
    });
});

// Update Seen Status
app.post(endpoints["Update Seen Status"], (req, res) => {
    const { not_id } = req.body;
    const sql = 'UPDATE notification SET seen = 1 WHERE not_id = ?';
    db.query(sql, [not_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Notification marked as seen successfully.' });
    });
});

//Get Seen Count
app.get(endpoints["Get Seen Count"], (req, res) => {
    const sql = 'SELECT COUNT(*) as count FROM notification WHERE seen = 0;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result[0].count);
    });
});

//Get Doctor Names
app.get(endpoints["Get Doctor Names"], (req, res) => {
    const sql = 'SELECT cd_id, doctor_name, d_type FROM channelling_doctor;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Current App Num
app.get(endpoints["Get Current App Num"], (req, res) => {
    const curr_date = req.params.curr_date;
    const cd_id = req.params.cd_id;
    if (!curr_date === '') {
        res.status(400).json({ error: 'Current date cannot be empty.' });
        return;
    }
    const sql = 'SELECT MAX(app_num) AS max_app_num FROM appointment WHERE app_date = ? AND cd_id=?;';
    db.query(sql, [curr_date, cd_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get User Details
app.get(endpoints["Get User Details"], authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM user;';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Authenticate User
app.post(endpoints["Authenticate User"], (req, res) => {
    const { email, password } = req.body;
  
    const sql = 'SELECT username, type, image_url FROM user WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }

        if (result.length === 0) {
            res.status(401).json({ error: 'Authentication failed. Invalid email or password.' });
        } else {
            const userName = result[0].username;
            const userType = result[0].type;
            const imageUrl = result[0].image_url;
            res.status(200).json({ message: 'Authentication successful.', user_name: userName, user_type: userType, image_url: imageUrl });
        }
    });
});

//Get Assistants
app.get(endpoints["Get Assistants"], (req, res) => {
    const sql = 'SELECT * FROM assistent';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Confirm Appointment Payment By Appo ID
app.get(endpoints["Confirm Appointment Payment By Appo ID"], (req, res) => {
    const appo_id = req.params.appo_id;
    const appo_idRegex = /^(?:[1-9]|[1-9]\d{1,2}|999)$/;
    if (!appo_idRegex.test(appo_id)) {
        res.status(400).json({ error: 'Invalid Appointment ID format.' });
        return;
    }
    const sql = 'UPDATE appointment SET payment = 1 WHERE app_id = ?';
    db.query(sql, [appo_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Personal Titles
app.get(endpoints["Get Personal Titles"], (req, res) => {
    const sql = 'SELECT * FROM personal_titles';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Latest Appointment ID
app.get(endpoints["Get Latest Appointment ID"], (req, res) => {
    const sql = 'SELECT MAX(app_id) AS app_id FROM appointment';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        const app_id = result[0].app_id;
        res.json({ app_id });
    });
});

// Update Channelling Doctor By Channelling Doctor ID
app.post(endpoints["Update Channelling Doctor By Channelling Doctor ID"], (req, res) => {
    const { doctor_name, d_type, nic, email, address, contact_no } = req.body;
    const cd_id = req.params.cd_id;
    const sql = 'UPDATE channelling_doctor SET doctor_name=?, d_type=?, nic=?, email=?, address=?, contact_no=? WHERE cd_id=?';
    db.query(sql, [doctor_name, d_type, nic, email, address, contact_no, cd_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Channelling doctor updated successfully.' });
    });
});

//Delete Channelling Doctor By Channelling Doctor ID
app.get(endpoints["Delete Channelling Doctor By Channelling Doctor ID"], (req, res) => {
    const cd_id = req.params.cd_id;
    const cd_idRegex = /^cd_[0-9]{3}$/;
    if (!cd_idRegex.test(cd_id)) {
        res.status(400).json({ error: 'Invalid Channelling Doctor ID format.' });
        return;
    }
    const sql = 'UPDATE channelling_doctor SET deleted = 1 WHERE cd_id = ?';
    db.query(sql, [cd_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Channelling Doctor
app.post(endpoints["Set Channelling Doctor"], (req, res) => {
    const { cd_id, doctor_name, d_type, nic, email, address, contact_no } = req.body;
    const sql = 'INSERT INTO channelling_doctor (cd_id, doctor_name, d_type, nic, email, address, contact_no) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [cd_id, doctor_name, d_type, nic, email, address, contact_no], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Channelling doctor added successfully.' });
    });
});

//Get Appointment Number
app.get(endpoints["Get Appointment Number"], (req, res) => {
    const sql = 'SELECT val FROM live_appointment WHERE app_no = 1';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Appointment Number
app.post(endpoints["Set Appointment Number"], (req, res) => {
    const val = req.params.app_no;
    const sql = 'UPDATE live_appointment SET val=? WHERE app_no = 1';
    db.query(sql, [val], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Live value updated successfully.' });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});