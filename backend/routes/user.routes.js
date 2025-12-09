const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const roleAuthorization = require("../middlewares/role.middleware");

router.post("/api/user", userController.createUser);
router.get("/api/users", roleAuthorization(["Manager", 1]), userController.getAllUsers);
router.delete("/api/user/:id", roleAuthorization(["Manager", 1]), userController.deleteUser);

module.exports = router;