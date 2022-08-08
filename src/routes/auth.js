const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const authData = require('../dataService/auth')

module.exports = function(app) {

    // Sign-up API call
    app.post('/auth/signup', 
    body('email').isLength({min: 5, max: 35}), 
    body('password').isLength({min: 1, max: 30}),
    body('fname').isLength({min: 1, max: 15}), 
    body('lname').isLength({min: 1, max: 15}), 
    async (req, res) => {
        try {
            // Extracts the validation errors from a request
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.json({status: 'validation mismatch'})
            } else {
                // Get user data to find matching emails
                const userData = await authData.getUser(req.body.email)
                if (userData != undefined){
                    return res.json({status: 'email exists', message: 'This Email is already taken'})
                }

                // If email was not taken, encrypt the password before adding it to the database
                const hashPassword = await bcrypt.hash(req.body.password, 15)
                const userDataAdd = await authData.addUser(req.body.email, hashPassword, req.body.fname, req.body.lname)
                // Initialize user profile data once registered
                const createProfile = await authData.addProfile(userDataAdd.user_id)

                // Return with authentication token
                const token = await getJwt(userDataAdd.user_id, req.body.email, req.body.fname, req.body.lname)
            console.log(token)
                res.json({ 
                    status: 'success',
                    message: 'signup successful', 
                    token: token, 
                    user: {
                        user_id: userDataAdd.user_id,
                        email: req.body.email, 
                        fname: req.body.fname, 
                        lname: req.body.lname, 
                    } 
                });
            }
        } catch (error) {
            return res.json({status: 'fail'})
        }
    });

    // Login API call
    app.post('/auth/login', 
    body('email').isLength({ min: 5, max: 35 }), 
    body('password').isLength({ min: 1, max: 30 }), 
    async (req, res) => {
        try {
            // Extracts the validation errors from a request
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.json({ status: "fail", err: errors.msg + ": " + errors.param })
            } else {
                // Get user data to find if email exists within the database
                const userData = await authData.getUser(req.body.email)
                if (userData == undefined) {
                    return res.json({ status: "email mismatch" })
                }

                // If email exists, compare the two encrypted password 
                const result = await bcrypt.compare(req.body.password, userData.user_password)
                if (!result) {
                    throw "Incorrect password"
                }
                
                // Return with authentication token
                const token = await getJwt(userData.user_id, userData.user_email, userData.user_firstname, userData.user_lastname)
                return res.json({
                    status: "success",
                    message: "login successful",
                    token: token,
                    user: {
                        user_id: userData.user_id,
                        email: userData.user_email,
                        fname: userData.user_firstname,
                        lname: userData.user_lastname,
                    }
                });
            }
        } catch (error) {
            return res.json({status: "password mismatch"})
        }
    });

}

const getJwt = async (user_id, email, fname, lname) => {
    var token = jwt.sign({user_id, email, fname, lname}, process.env.TOKEN_SECRET );
    return token
}