const router = require("express").Router();
const Ticket = require("../models/Ticket");

const authenticate = require("../middleware/auth");

const {
  ticketValidation,
  ticketUpdateValidation,
} = require("../utils/validation");
const logger = require("../utils/logger");

router.get("/", authenticate, async (req, res) => {
  let data;

  if (req.userRole !== "admin")
    data = await Ticket.find({ userId: req.userId });
  else data = await Ticket.find();

  if (!data) return res.status(404).send({ message: "No tickets found" });

  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.set("Content-Range", data.length);

  res.send(data);
});

router.get("/:id", authenticate, async (req, res) => {
  const data = await Ticket.findOne({ _id: req.params.id });

  if (!data) {
    logger.error(`Ticket not found in get request /:id ${req.params.id}`);
    return res.status(404).send({ message: "Ticket not found" });
  }

  if (req.userRole !== "admin" && data.userId !== data.userId) {
    logger.error(`Forbidden in get request /:id ${req.params.id}`);
    return res.status(403).send({ message: "Forbidden" });
  }

  res.send(data);
});

router.post("/", authenticate, async (req, res) => {
  const { error } = ticketValidation(req.body);

  if (error != null) {
    logger.error(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

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
    .catch((err) => {
      logger.error(err.message);
      res.status(400).send({ message: err.message });
    });
});

router.put("/:id", authenticate, async (req, res) => {
  const { error } = ticketUpdateValidation(req.body);

  if (error != null) return res.status(400).send(error.details[0].message);

  if (req.userRole !== "admin") {
    const ticket = await Ticket.findOne({ _id: req.params.id });

    if (!ticket) {
      logger.error(`Ticket not found in put request /:id ${req.params.id}`);
      return res.status(404).send({ message: "Ticket not found" });
    }

    if (ticket.userId.valueOf() !== req.userId) {
      logger.error(`Forbidden in put request /:id ${req.params.id}`);
      return res.status(403).send({ message: "Forbidden" });
    }
  }

  try {
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body, last_update: Date.now() },
      { new: true } // Return updated document
    );

    return res.status(200).send({ id: ticket._id });
  } catch (err) {
    logger.error(`Error in put request /:id ${req.params.id}`);
    return res.status(400).send({ message: "No se pudo actualizar" });
  }
});

module.exports = router;
