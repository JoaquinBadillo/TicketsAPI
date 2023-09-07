const router = require('express').Router();
const Ticket = require('../models/Ticket');

// const authenticate = require('../middleware/auth');

router.get('/', async (_req, res) => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    
    const data = await Ticket
    .find({
        "$expr": { 
            "$and": [
                { "$eq": [{ "$week": "$date" }, Math.ceil(days / 7)] },
                { "$eq": [{ "$year": "$date" }, currentDate.getFullYear()] }
            ]
        }
    })
    .select({ 
        _id: 0, 
        id: 1, 
        status: 1, 
        location: 1
    });

    if (!data)
        return res.status(404).send({ message: 'No tickets this week' });

    res.set('Access-Control-Expose-Headers', 'Content-Range');
    res.set('Content-Range', data.length);
    res.send(data);
});

module.exports = router;
