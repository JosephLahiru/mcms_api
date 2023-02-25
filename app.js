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
            res.status(500).json({ error: 'Internal server error.' });
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
            res.status(500).json({ error: 'Internal server error.' });
            return;
        }
        res.json({ message: 'Doctor added successfully.' });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});
