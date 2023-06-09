const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = process.env.MONGO_DB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, () => {
  console.log(`Server is running at port:${port}`);
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb connected...");
});

app.use("/users", require("./routes/users.routes"));
