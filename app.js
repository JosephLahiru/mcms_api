const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: '*',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hi!, I am Online!!!');
});

//Get Doctors
app.get('/get_doctors', (req, res) => {
    const sql = 'SELECT * FROM doctor';
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
app.get('/get_doctors/:d_id', (req, res) => {
    const d_id = req.params.d_id;
    const d_idRegex = /^D\d{3}$/;
    if (!d_idRegex.test(d_id)) {
        res.status(400).json({ error: 'Invalid doctor ID format.' });
        return;
    }
    const sql = 'SELECT * FROM doctor WHERE d_id = ?';
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
app.post('/set_doctors', (req, res) => {
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
app.get('/get_patients', (req, res) => {
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
app.get('/get_patients/:nic', (req, res) => {
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
app.post('/set_patients', (req, res) => {
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
app.get('/get_profit', (req, res) => {
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
app.get('/get_profit/:date', (req, res) => {
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
app.get('/get_weekly_profit/:date', (req, res) => {
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
app.get('/get_monthly_profit/:date', (req, res) => {
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
app.post('/set_profit', (req, res) => {
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
app.get('/get_attendance', (req, res) => {
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
app.get('/get_attendance/:assit_id', (req, res) => {
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
app.get('/get_attendance/:date', (req, res) => {
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
app.get('/get_attendance/:assit_id/:date', (req, res) => {
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
app.post('/set_attendance', (req, res) => {
    const { assit_id, date, status } = req.body;
    const sql = 'INSERT INTO attendance (assit_id, date, status) VALUES (?, ?, ?)';
    db.query(sql, [assit_id, date, status], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Attendance added successfully.' });
    });
});

//Get Appointment
app.get('/get_appointment', (req, res) => {
    const sql = 'SELECT * FROM appointment';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Get Appointment By NIC
app.get('/get_appointment/:nic', (req, res) => {
    const nic = req.params.nic;
    const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
    if (!nicRegex.test(nic)) {
        res.status(400).json({ error: 'Invalid NIC format.' });
        return;
    }
    const sql = 'SELECT * FROM appointment WHERE nic = ?';
    db.query(sql, [nic], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Appointment
app.post('/set_appointment', (req, res) => {
    const { first_name, last_name, nic, address, age, gender, contact_num, email, p_type, cd_id } = req.body;
    const sql = 'INSERT INTO appointment (first_name, last_name, nic, address, age, gender, contact_num, email, p_type, cd_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [first_name, last_name, nic, address, age, gender, contact_num, email, p_type, cd_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Appointment added successfully.' });
    });
});

//Get Notification
app.get('/get_notification', (req, res) => {
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
app.post('/set_notification', (req, res) => {
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
app.get('/get_stock', (req, res) => {
    const sql = 'SELECT * FROM stock';
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
app.get('/get_stock/:prdct_id', (req, res) => {
    const prdct_id = req.params.prdct_id;
    const prdct_idRegex = /^(?:[1-9]|[1-9]\d{1,2}|999)$/;
    if (!prdct_idRegex.test(prdct_id)) {
        res.status(400).json({ error: 'Invalid Product ID format.' });
        return;
    }
    const sql = 'SELECT * FROM stock WHERE prdct_id = ?';
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
app.post('/set_stock', (req, res) => {
    const { brand_name, prdct_name, description, mfg_date, exp_date, ac_price, sell_price, total_quantity, med_type, total_quantity_ac_price, total_quantity_sell_price } = req.body;
    const sql = 'INSERT INTO stock (brand_name, prdct_name, description, mfg_date, exp_date, ac_price, sell_price, total_quantity, med_type, total_quantity_ac_price, total_quantity_sell_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [brand_name, prdct_name, description, mfg_date, exp_date, ac_price, sell_price, total_quantity, med_type, total_quantity_ac_price, total_quantity_sell_price], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json({ message: 'Stock added successfully.' });
    });
});

//SET Ping
app.post('/set_ping', (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});