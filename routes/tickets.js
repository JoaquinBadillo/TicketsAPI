const router = require("express").Router();
const Ticket = require("../models/Ticket");
const sanitizer = require("../middleware/sanitize");

const authenticate = require("../middleware/auth");

const {
  ticketValidation,
  ticketUpdateValidation,
} = require("../utils/validation");
const logger = require("../utils/logger");

router.get("/", authenticate, sanitizer, async (req, res) => {
  let data;

  if (req.userRole !== "admin") {
    data = await Ticket.find({ userId: req.userId }).select({
      _id: 1,
      title: 1,
      folio: 1,
      description: 1,
      status: 1,
      priority: 1,
      category: 1,
      incident: 1,
      location: 1,
      date: 1,
      last_update: 1,
    });
  } else {
    data = await Ticket.find().select({
      _id: 1,
      title: 1,
      description: 1,
      status: 1,
      folio: 1,
      priority: 1,
      category: 1,
      incident: 1,
      location: 1,
      userId: 1,
      date: 1,
      last_update: 1,
    });
  }

  if (!data) return res.status(404).send({ message: "No tickets found" });

  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.set("Content-Range", data.length);

  res.send(data);
});

router.get("/:id", authenticate, sanitizer, async (req, res) => {
  const data = await Ticket.findOne({ _id: req.params.id }).select({
    _id: 1,
    title: 1,
    description: 1,
    status: 1,
    folio: 1,
    priority: 1,
    category: 1,
    incident: 1,
    location: 1,
    userId: req.userRole === "admin" ? 1 : 0,
    date: 1,
    last_update: 1,
  });

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

router.post("/", authenticate, sanitizer, async (req, res) => {
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
    folio: req.body.folio,
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

router.put("/:id", authenticate, sanitizer, async (req, res) => {
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
    // Drop content that should not be edited.
    // (React Admin sends all this data back, that's why Joi is insufficient)
    if (req.body._id != null) delete req.body._id;

    if (req.body.id != null) delete req.body.id;

    if (req.body.__v != null) delete req.body.__v;

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
