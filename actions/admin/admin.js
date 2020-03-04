const User = require('../../model/User');
const Admin = require('../../model/admin');
const { registerValidation } = require('../../validation');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    const user = await User.find({});

    if(!user) {
        return res.send(200).send('No User Available !!');
    }

    return res.status(200).send(user);
};

const registration = async (req, res) => {
    const { error } = registerValidation(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    const emailExist = await Admin.findOne({
        email: req.body.email
    });

    if(emailExist) {
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
        return res.send({Admin: admin._id});
    } catch(err) {
        console.log(err);
        return res.status(400).send(err);
    }
};

module.exports.getAllUsers = getAllUsers;
module.exports.registration = registration;