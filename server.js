const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, result) => {
    if(err) {
        console.log("Error");
        throw err;
    }
    console.log("DataBase Connected !!");
});

app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`server started at ${process.env.PORT}`);
})