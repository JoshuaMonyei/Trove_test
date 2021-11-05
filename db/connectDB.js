// Mongoose set-up
const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWD}@cluster0.agpen.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// connection string to database
function connectDB() {
    mongoose.connect(connectionString, (err) => {
        if (err) {
            console.log(err);
        } else { console.log("Database connection established"); }
    });
}

module.exports = connectDB;
