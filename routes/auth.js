const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const { registerValidation, loginValidation} = require('../utils/validation');

const saltRounds = process.env.SALT;

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    
    if (error != null)
        return res.status(400).send(error.details[0].message);

    const emailExists = await User.findOne({email: req.body.email});

    if (emailExists)
        return res.status(400).send('Email already exists');

    const password = await bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(req.body.password, salt);
        })
        .catch(err => {
            console.log(err);
        });

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });

    try {
        const savedUser = await user.save();
        res.send({savedUser: savedUser._id});
    }

    catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;
