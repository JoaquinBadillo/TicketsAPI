const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation} = require('../utils/validation');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    
    if (error != null)
        return res.status(400).send(error.details[0].message);

    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists)
        return res.status(400).send({ message: 'Email already exists' });

    const user = await bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(req.body.password, salt))
    .then(hash => {
        return new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            role: req.body.role
        });
    })
    .catch(err => { console.log(err) });

    if (!user)
        return res.status(500).send({ message: 'User Registration Failed' });

    await user.save()
    .then((usr) => res.send({savedUser: usr._id}))
    .catch((err) => res.status(400).send({message: err.message}));
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);

    if (error != null)
        return res.status(400).send(error.details[0].message);


    const user = await User.findOne({ email: req.body.email })
    .catch(err => { console.log(err) });

    if (!user) 
        return res.status(401).send({ message: 'Invalid Credentials' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword)
        return res.status(401).send({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });

    return res.header('x-access-token', token).send({ message: 'Logged in' });
});



module.exports = router;
