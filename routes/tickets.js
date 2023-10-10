const router = require("express").Router();
const Ticket = require("../models/Ticket");

const authenticate = require("../middleware/auth");

const {
  ticketValidation,
  ticketStatusValidation,
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
    status: req.body.status || "Open",
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
  const { error } = ticketStatusValidation(req.body);

  if (error != null) return res.status(400).send(error.details[0].message);

  if (req.role === "admin") {
    const ticket = await Ticket.findOneAndUpdate(
      { id: req.body.id },
      { status: req.body.status }
    )
      .save()
      .then((ticket) => res.send({ updatedTicket: ticket.id }))
      .catch((err) => res.status(400).send({ message: err.message }));
  } else {
    const ticket = await Ticket.findOneAndUpdate(
      { id: req.body.id },
      { status: req.body.status }
    );

    if (req.userId !== ticket.userId)
      return res.status(403).send({ message: "Forbidden" });

    ticket
      .save()
      .then((ticket) => res.send({ updatedTicket: ticket.id }))
      .catch((err) => res.status(400).send({ message: err.message }));
  }
});

module.exports = router;
