const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

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

app.post('/set_earnings', (req, res) => {
    const { date, free_amt, ac_cost_free, paid_amt, ac_cost_paid, profit} = req.body;
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


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});


//jamila
//patient data - done
//doctor data - done
//channelling_doctor

//umeen
//medicine
//check stock

//pathum
//assistant details
//medicine data

//TODO tables
//attendance
//returning and none table