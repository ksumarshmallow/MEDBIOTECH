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
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});