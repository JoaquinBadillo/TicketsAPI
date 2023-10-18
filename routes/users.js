const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/auth");
const { hasRole, adminRole } = require("../middleware/role");

const {
  registerValidation,
  loginValidation,
  accountValidation,
  userUpdateValidation
} = require("../utils/validation");
const logger = require("../utils/logger");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.get("/", authenticate, hasRole(adminRole), async (req, res) => {
  const data = await User.find().select({
    _id: 1,
    name: 1,
    email: 1,
    role: 1,
  });

  if (!data) {
    logger.error("No users found in get request");
    return res.status(404).send({ message: "No users found" });
  }

  res.set("Access-Control-Expose-Headers", "Content-Range");
  res.set("Content-Range", data.length);
  res.send(data);
});

router.get("/:id", authenticate, hasRole(adminRole), async (req, res) => {
  const data = await User.findOne({ _id: req.params.id }).select({
    _id: 1,
    name: 1,
    email: 1,
    role: 1,
  });

  if (!data) {
    logger.error("User not found in get request /:id");
    return res.status(404).send({ message: "User not found" });
  }

  res.send(data);
});

router.post("/", authenticate, hasRole(adminRole), async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error != null) {
    logger.error(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) {
    logger.error(`Email already exists in post request: ${emailExists.email}`);
    return res.status(400).send({ message: "Email already exists" });
  }

  const user = await bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(req.body.password, salt))
    .then((hash) => {
      return new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: req.body.role,
      });
    })
    .catch((err) => {
      logger.error(err);
    });

  if (!user) {
    logger.error(`User Registration failed for user: ${req.body.name}`);
    return res.status(500).send({ message: "User Registration Failed" });
  }

  await user
    .save()
    .then((usr) => res.send({ savedUser: usr._id }))
    .catch((err) => {
      res.status(400).send({ message: err.message })
    });
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error != null) {
    logger.error(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email }).catch((err) => {
    logger.error(err);
    console.log(err);
  });

  if (!user) {
    logger.error(`User not found in login request: ${req.body.email}`);
    return res.status(401).send({ message: "Invalid Credentials" });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    logger.error(`Invalid Password in login request: ${req.body.email}`);
    return res.status(401).send({ message: "Invalid Credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 86400 }
  );

  return res.send({ id: user._id, auth: token, role: user.role });
});

router.put("/:id", authenticate, async (req, res) => {
  const { error } = userUpdateValidation(req.body);

  if (error != null) {
    logger.error(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  try {
    if (req.body._id != null) delete req.body._id;
    if (req.body.id != null) delete req.body.id;
    if (req.body.__v != null) delete req.body.__v;
    if (req.body.password != null) delete req.body.password;
    if (req.body.role != null) delete req.body.role;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true } // Return updated document
    );

    return res.status(200).send({ id: user._id });
  } catch (err) {
    logger.error(`Error in put request for user /:id ${req.params.id}`);
    return res.status(400).send({ message: "No se pudo actualizar ticket" });
  }
});

router.put("/changepass", authenticate, async (req, res) => {
  const { error } = accountValidation(req.body);

  if (error != null) {
    logger.error(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  try {
    const user = await bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(req.body.password, salt))
      .then((hash) => {
        return User.findOneAndUpdate({ _id: req.userId }, { password: hash });
      })
      .catch((err) => {
        console.log(err);
        logger.error(err);
      });

    if (!user) {
      logger.error(`Password Change Failed for user: ${req.body.name}`);
      return res.status(404).send({ message: "Password Change Failed" });
    }

    await user
      .save()
      .then((usr) => {
        logger.info(`Password Changed for user: ${user.name}`);
        res.send({ savedUser: usr._id })
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Password Change Failed" });
  }
});

router.get("/role", authenticate, async (req, res) => {
  const user = await User.findOne({ _id: req.userId }).catch((err) => {
    console.log(err);
  });

  if (!user) {
    logger.error(`User not found in get request /role: ${req.userId}`);
    return res.status(404).send({ message: "User not found" });
  }

  res.send({ role: user.role });
});

module.exports = router;
