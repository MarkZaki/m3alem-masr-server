const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// dot env config
const dotenv = require("dotenv");
dotenv.config();

// Setting
const app = express();
app.use(express.json());
app.use(cors());

// Connect Db
const db = process.env.DB_URI;
mongoose.connect(
	db,
	{ useNewUrlParser: true, setUnifiedTopology: true, useUnifiedTopology: true },
	() => console.log("DB connected...")
);

// Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/posts", require("./routes/posts"));

// Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Running..."));
