const router = require("express").Router();
const User = require("../model/Users.schema");
const bcrypt = require("bcrypt");
const Authorization = require("../middleware/Auth");
const jwt = require("jsonwebtoken");
const UserAuth = require("../middleware/deletePostsAuth");

router.get("/", Authorization, async (req, res) => {
  await User.find()
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json(err));
});

// ? GET all data of specific user
router.get("/:id", UserAuth, async (req, res) => {
  await User.findById(req.params.id)
    .then((result) => res.json(result))
    .catch((err) => res.status(401).json(err));
});

// * Register routes for all users
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

// * Login routes for all users
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username: username });

    if (!user) return res.status(404).send({ message: "Username not found." });

    const validPassword = await bcrypt.compare(password, user.hash_password);

    if (!validPassword)
      return res.status(401).send({ message: "Invalid Password" });

    const token = await jwt.sign(
      {
        username,
        userid: user.id,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).send({
      message: "Loggin in Successfull",
      token,
    });
  } catch {
    res.status(500).send({ message: " auth Server error" + error });
    console.log(error);
  }
});

// * GET all posts
router.get("/all/posts", Authorization, async (req, res) => {
  try {
    const posts = await User.find().select("username posts");

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// * add Posts routess
router.put("/posts/:id", Authorization, async (req, res) => {
  const id = req.params.id;
  const username = req.body.username;
  const title = req.body.title;
  const content = req.body.content;

  await User.findByIdAndUpdate(
    { _id: id },
    {
      $push: {
        posts: {
          title,
          content,
        },
      },
    }
  )
    .then((result) => res.json("Successfullt posted."))
    .catch((err) => res.status(400).send(err));
});

router.delete("/delete/posts/:id", UserAuth, async (req, res) => {
  const postsId = req.body.postsId;

  await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $pull: {
        posts: {
          _id: postsId,
        },
      },
    }
  )
    .then((result) => res.json("Posts successfully deleted."))
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
