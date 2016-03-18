'use strict';

// Load Modules =================================
const path = require('path');
const fs = require('fs');

// Internals ====================================
const internals = {};

// Reading all files to expose ==================
fs.readdirSync(__dirname).forEach((file) => {

    // If its the current file ignore it
    if (file === 'index.js') return;

    let ctrlName = path.basename(file, '.js');
    ctrlName = ctrlName.charAt(0).toUpperCase() + ctrlName.substr(1).toLowerCase();

    // Store module with its name (from filename)
    internals[ctrlName] = require(path.join(__dirname, file));
});

// Exposing =====================================
module.exports = internals;
