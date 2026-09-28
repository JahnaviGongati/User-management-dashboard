console.log("NEW MONGODB SERVER CODE IS RUNNING");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===============================
// MongoDB User Schema
// ===============================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("User Management API is running!");
});

// ===============================
// GET ALL USERS
// ===============================

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get users"
    });
  }
});

// ===============================
// ADD USER
// ===============================

app.post("/users", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Name, email and role are required"
      });
    }

    const newUser = new User({
      name,
      email,
      role
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user"
    });
  }
});

// ===============================
// UPDATE USER
// ===============================

app.put("/users/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to update user"
    });
  }
});

// ===============================
// DELETE USER
// ===============================

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Failed to delete user"
    });
  }
});

// ===============================
// CONNECT TO MONGODB
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });