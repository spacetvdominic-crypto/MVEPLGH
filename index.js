const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

// PASTE YOUR GOOGLE WEB APP URL HERE
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyAHFBzTDnr8Qq0MiGTGERLxF6XwrDJR3RibNQoulZZigg8ta3FJixUubY_BV_pAVA/exec";

app.set('view engine', 'ejs');
app.use(express.static('public'));

// HOME PAGE: Manual ID Entry for Broken Cameras
app.get('/', (req, res) => {
    res.render('index');
});

// VERIFICATION PAGE: Handles both QR Scans and Manual Entry
app.get('/verify', async (req, res) => {
    const id = req.query.id;
    
    if (!id) {
        return res.redirect('/');
    }

    try {
        // Ask Google Sheets for the data
        const response = await axios.get(`${GOOGLE_SCRIPT_URL}?id=${id}`);
        const employee = response.data;
        
        // If Google returns an error or no name
        if (employee.status === "Invalid ID" || !employee.name) {
            return res.render('status', { 
                employee: { 
                    name: "NOT FOUND", 
                    status: "Denied", 
                    address: "Unknown", 
                    id: id,
                    dob: "N/A" 
                } 
            });
        }

        // Attach the ID so it shows on the badge
        employee.id = id; 

        res.render('status', { employee });
    } catch (error) {
        console.error(error);
        res.status(500).send("Database Connection Error. Check your Google Script URL.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
