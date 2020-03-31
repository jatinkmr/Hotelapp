const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use('/api', routes);

app.all("*", (req, res, next) => {
    next(notFound());
});

app.listen(process.env.PORT, () => {
    console.log(`server started at ${process.env.PORT}`);
})