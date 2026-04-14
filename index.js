const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyAHFBzTDnr8Qq0MiGTGERLxF6XwrDJR3RibNQoulZZigg8ta3FJixUubY_BV_pAVA/exec";

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/verify', async (req, res) => {
    const id = req.query.id;
    try {
        const response = await axios.get(`${GOOGLE_SCRIPT_URL}?id=${id}`);
        const employee = response.data;
        res.render('status', { employee });
    } catch (error) {
        res.send("Error connecting to database.");
    }
});

app.listen(process.env.PORT || 3000);
