
const express = require("express");
const router = express.Router();

const User = require("../models/User");

// 1. Create user
router.post("/", async (req, res, next) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

// 2. Get all users
router.get("/", async (req, res, next) => {
    try {
        const users = await User.find();

        res.json(users);
    } catch (error) {
        next(error);
    }
});

// 3. Get user by ID
router.get("/:id", async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
