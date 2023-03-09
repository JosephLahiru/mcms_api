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
            res.status(500).json({ error: 'Internal server error.' + err   });
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
            res.status(500).json({ error: 'Internal server error.' + err   });
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
    const {first_name, last_name, nic, age, p_type, gender, app_date, contact_no, address } = req.body;
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

//Get Earnings
app.get('/get_earnings', (req, res) => {
    const sql = 'SELECT * FROM earnings';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err  });
            return;
        }
        res.json(result);
    });
});

//Get Earnings By ID
app.get('/get_earnings/:date', (req, res) => {
    const date = req.params.date;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ error: 'Invalid date format.' });
        return;
    }
    const sql = 'SELECT * FROM earnings WHERE date = ?';
    db.query(sql, [date], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Earnings
app.post('/set_earnings', (req, res) => {
    const { date, free_amt, ac_cost_free, paid_amt, ac_cost_paid, profit } = req.body;
    const sql = 'INSERT INTO earnings (date, free_amt, ac_cost_free, paid_amt, ac_cost_paid, profit) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [date, free_amt, ac_cost_free, paid_amt, ac_cost_paid, profit], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err});
            return;
        }
        res.json({ message: 'Earning added successfully.' });
    });
});

//Get Medicine
app.get('/get_medicine', (req, res) => {
    const sql = 'SELECT * FROM medicine';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err  });
            return;
        }
        res.json(result);
    });
});

//Get Medicine By ID
app.get('/get_medicine/:med_id', (req, res) => {
    const med_id = req.params.med_id;
    const med_idRegex = /^M\d{3}$/;
    if (!med_idRegex.test(med_id)) {
        res.status(400).json({ error: 'Invalid Medicine ID format.' });
        return;
    }
    const sql = 'SELECT * FROM medicine WHERE med_id = ?';
    db.query(sql, [med_id], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err });
            return;
        }
        res.json(result);
    });
});

//Set Medicine
app.post('/set_medicine', (req, res) => {
    const { med_id, m_name, m_type, description, ex_date, med_brand } = req.body;
    const sql = 'INSERT INTO medicine (med_id, m_name, m_type, description, ex_date, med_brand) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [med_id, m_name, m_type, description, ex_date, med_brand], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err});
            return;
        }
        res.json({ message: 'Medicine added successfully.' });
    });
});

//Get Attendance
app.get('/get_attendance', (req, res) => {
    const sql = 'SELECT * FROM attendance';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err  });
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
            res.status(500).json({ error: 'Internal server error.' + err});
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
            res.status(500).json({ error: 'Internal server error.' + err  });
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
            res.status(500).json({ error: 'Internal server error.' + err});
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
            res.status(500).json({ error: 'Internal server error.' + err  });
            return;
        }
        res.json(result);
    });
});

//Set Notification
app.post('/set_notification', (req, res) => {
    const { body, category } = req.body;
    const sql = 'INSERT INTO notification (body, category) VALUES (?, ?)';
    db.query(sql, [body, category], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal server error.' + err});
            return;
        }
        res.json({ message: 'Notification added successfully.' });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});