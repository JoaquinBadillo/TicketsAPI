const router = require('express').Router();
const Ticket = require('../models/Ticket');

const authenticate = require('../middleware/auth');

const { ticketValidation } = require('../utils/validation');

router.get('/', async (req, res) => {
    await Ticket.find()
    .then((tickets) => res.send(tickets))
    .catch((err) => res.status(400).send({message: err.message}));
});

router.post('/', authenticate, async (req, res) => {
    const { error } = ticketValidation(req.body);
    
    if (error != null)
        return res.status(400).send(error.details[0].message);

    const ticket = new Ticket({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        category: req.body.category,
        incident: req.body.incident,
        location: req.body.location,
        user: req.userId
    });

    await ticket.save()
    .then((ticket) => res.send({savedTicket: ticket._id}))
    .catch((err) => res.status(400).send({message: err.message}));
});

module.exports = router;