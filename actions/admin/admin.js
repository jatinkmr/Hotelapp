const User = require('../../model/User');
const Admin = require('../../model/admin');
const { registerValidation, loginValidation } = require('../../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    const user = await User.find({});

    if (!user) {
        return res.send(200).send('No User Available !!');
    }

    return res.status(200).send(user);
};

const getUsername = async (req, res) => {
    const userName = req.params.username;
    console.log('userName => ', userName);
    const user = await User.findOne({
        name: userName
    });

    if (!user) {
        return res.status(400).send('UserName Does Not Exists !!');
    }

    return res.status(200).send('UserName Exists !!');
};

const login = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const admin = await Admin.findOne({
        email: req.body.email
    });

    if (!admin) {
        return res.status(400).send('Email Does Not Exists !!');
    }

    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if (!validPass) {
        return res.status(400).send('Invalid Password !!');
    }

    const token = jwt.sign({
        _id: admin._id
    }, process.env.ADMIN_TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY
    });
    res.header('auth-token', token).send(token);
};

const registration = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const emailExist = await Admin.findOne({
        email: req.body.email
    });

    if (emailExist) {
        return res.status(400).send('Email already Exists !!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedAdmin = await admin.save();
        // return res.send(savedAdmin);
        return res.send({ Admin: admin._id });
    } catch (err) {
        console.log(err);
        return res.status(400).send(err);
    }
};

module.exports = {
    getAllUsers,
    registration,
    login,
    getUsername
};