const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');

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
app.use('/api/user', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`server started at ${process.env.PORT}`);
})