const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const create_token = async (id) => {
    try {

        const token = await jwt.sign({ _id: id }, config.secret_jwt);
        return token; 

    } catch (error) {
        (req, res) => {
            res.status(400).send(error.message);
        }
    }
}

//SIGN_UP OR REGISTER

const securePassword = async (password) => {


    try {

        const passwordHash = await bcryptjs.hash(password, 10);
        return passwordHash;
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const register_user = async (req, res) => {

    try {

        const spassword = await securePassword(req.body.password);

        const user = new User({
            Username: req.body.Username,
            email: req.body.email,
            password: spassword,
            mobile: req.body.mobile,
            image: req.file.filename
        });

        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            res.status(200).send({ success: false, msg: "This email is already registered" });
        }
        else {
            const user_data = await user.save();
            res.status(200).send({ success: true, data: user_data });
        }

    } catch (error) {
        res.status(400).send(error.message);
    }

}


//login method

const user_login = async (req, res) => {
    try {

        const email = req.body.email;
        const Username = req.body.Username;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        const userData2 = await User.findOne({ Username: Username });

        if (userData) {
            const passwordMatch = await bcryptjs.compare(password, userData.password);
            if (passwordMatch) {
                const tokenData = await create_token(userData._id);
                const userResult = {
                    _id: userData._id,
                    Username: userData.Username,
                    email: userData.email,
                    password: userData.password,
                    image: userData.image,
                    mobile: userData.mobile,
                    token: tokenData
                }
                const response = {
                    success: true,
                    msg: "User Details",
                    data: userResult
                }
                res.status(200).send(response);
            }
        }

            else if (userData2) {
                const passwordMatch = await bcryptjs.compare(password, userData2.password);
                if (passwordMatch) {
                    const tokenData = await create_token(userData2._id);
                    const userResult = {
                        _id: userData2._id,
                        Username: userData2.Username,
                        email: userData2.email,
                        password: userData2.password,
                        image: userData2.image,
                        mobile: userData2.mobile,
                        token: tokenData
                    }
                    const response = {
                        success: true,
                        msg: "User Details",
                        data: userResult
                    }
                    res.status(200).send(response);
                }

                else {
                    res.status(200).send({ success: false, msg: "Login Details are incorrect" });
                }
            }

            else {
                res.status(200).send({ success: false, msg: "Login Details are incorrect" });
            }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    register_user,
    user_login
}