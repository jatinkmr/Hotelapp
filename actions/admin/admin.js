const User = require('../../model/User');

const getAllUsers = async (req, res) => {
    const user = await User.find({});

    if(!user) {
        return res.send(200).send('No User Available !!');
    }

    return res.status(200).send(user);
};

module.exports.getAllUsers = getAllUsers;