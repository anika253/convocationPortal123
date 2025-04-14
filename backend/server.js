const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const studentRoutes = require("./Routes/studentRoutes");
const adminRoutes = require("./Routes/adminRoutes"); // <-- Added

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes); // <-- Added

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));
