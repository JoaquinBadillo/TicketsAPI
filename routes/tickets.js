const router = require("express").Router();
const Ticket = require("../models/Ticket");

const authenticate = require("../middleware/auth");

const {
  ticketValidation,
  ticketUpdateValidation,
} = require("../utils/validation");

router.get("/", async (req, res) => {
  const data = await Ticket.find();

  if (!data) return res.status(404).send({ message: "No tickets found" });

  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.set("Content-Range", data.length);
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const data = await Ticket.findOne({ _id: req.params.id });

  if (!data) return res.status(404).send({ message: "Ticket not found" });

  res.send(data);
});

router.post("/", authenticate, async (req, res) => {
  const { error } = ticketValidation(req.body);

  if (error != null) return res.status(400).send(error.details[0].message);

  const ticket = new Ticket({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || "Abierto",
    priority: req.body.priority,
    category: req.body.category,
    incident: req.body.incident,
    location: req.body.location,
    userId: req.userId,
  });

  await ticket
    .save()
    .then((ticket) => res.send({ savedTicket: ticket._id }))
    .catch((err) => res.status(400).send({ message: err.message }));
});

router.put("/:id", authenticate, async (req, res) => {
  const { error } = ticketUpdateValidation(req.body);


  if (error != null) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  try {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id },
      {...req.body, last_update: Date.now()},
      { new: true } // Return updated document
    );
    
    return res.status(200).send({ id: ticket._id });
  } 
  
  catch (err) {
    return res.status(400).send({ message: "No se pudo actualizar" });
  }
});

module.exports = router;
