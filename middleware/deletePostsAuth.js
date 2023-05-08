const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("bearer");

  // ? Check if Token is available
  if (!token) return res.status(404).send({ message: "No token found." });

  try {
    const user = await jwt.verify(token, process.env.TOKEN_KEY);

    if (user.userid !== req.params.id)
      return res.status(408).send({
        deletemsg: "You cant delete this posts",
        usermsg: "Invalid Token",
      });

    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token." });
  }
};
