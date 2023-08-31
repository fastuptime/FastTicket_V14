const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config.js');

mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

const supportSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    subject: String,
    userid: String,
    messages: Array, 
    /*
    Example: 
    messages: [
        {
            userid: 32434564564563443, // discord id
            message: "XXX",
            type: "user", // support / admin / user
            created_at: "12/12/2020 12:12:12",
        }
    ]
    */
});

module.exports = mongoose.model('Support', supportSchema);