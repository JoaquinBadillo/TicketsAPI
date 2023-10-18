const router = require("express").Router();
const Ticket = require("../models/Ticket");

const authenticate = require("../middleware/auth");
const { hasRole, adminRole } = require("../middleware/role");
const logger = require("../utils/logger");

router.get("/status", authenticate, hasRole(adminRole), async (_req, res) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  const data = await Ticket.find({
    $expr: {
      $and: [
        { $eq: [{ $isoWeek: "$date" }, Math.ceil(days / 7)] },
        { $eq: [{ $year: "$date" }, currentDate.getFullYear()] },
      ],
    },
  }).select({
    _id: 0,
    id: 1,
    status: 1,
    location: 1,
  });

  if (!data) {
    logger.error("No tickets found in get request /status for this week");
    return res.status(404).send({ message: "No tickets this week" });
  }

  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.set("Content-Range", data.length);
  res.send(data);
});

router.get(
  "/incidents",
  authenticate,
  hasRole(adminRole),
  async (_req, res) => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    const data = await Ticket.find({
      $expr: {
        $and: [
          { $eq: [{ $isoWeek: "$date" }, Math.ceil(days / 7)] },
          { $eq: [{ $year: "$date" }, currentDate.getFullYear()] },
        ],
      },
    }).select({
      _id: 0,
      id: 1,
      category: 1,
    });

    if (!data) {
      logger.error("No tickets found in get request /incidents for this week");
      return res.status(404).send({ message: "No tickets this week" });
    }

    res.set("Access-Control-Expose-Headers", "Content-Range");
    res.set("Content-Range", data.length);
    res.send(data);
  }
);

router.get("/location", authenticate, hasRole(adminRole), async (_req, res) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  const data = await Ticket.find({
    $expr: {
      $and: [
        { $eq: [{ $isoWeek: "$date" }, Math.ceil(days / 7)] },
        { $eq: [{ $year: "$date" }, currentDate.getFullYear()] },
      ],
    },
  }).select({
    _id: 0,
    id: 1,
    location: 1,
  });

  if (!data) {
    logger.error("No tickets found in get request /location for this week");
    return res.status(404).send({ message: "No tickets this week" });
  }

  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.set("Content-Range", data.length);
  res.send(data);
});

module.exports = router;
