const router = require("express").Router();
const User = require("../model/Users.schema");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  await User.find()
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json(err));
});

router.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const checkUsername = await User.findOne({ username: username });

  if (checkUsername)
    return res.status(409).send({ message: "Username already exist." });

  const salt = await bcrypt.genSalt(Number(process.env.SALT));

  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    raw_password: password,
    hash_password: hashPassword,
  });

  newUser
    .save()
    .then((result) => res.json("Successfully registered"))
    .catch((err) => res.status(400).json(err));
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username: username });

    if (!user) return res.status(404).send({ message: "Username not found." });

    const validPassword = await bcrypt.compare(password, user.hash_password);

    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });

    res.status(200).send({
      message: "Loggin in Successfull",
    });
  } catch {
    res.status(500).send({ message: " auth Server error" + error });
    console.log(error);
  }
});

module.exports = router;
