const express = require('express');
const path = require('path');
const fs = require('fs');
const Papa = require('papaparse');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// add static files
app.use(express.static(path.join(__dirname, 'public')));

// start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started at http://158.160.137.217:${port}`);
});
