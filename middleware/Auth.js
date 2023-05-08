const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("bearer");

  // ? Check if Token is available
  if (!token) return res.status(404).send({ message: "No token found." });

  try {
    const user = await jwt.verify(token, process.env.TOKEN_KEY);
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token." });
  }
};
