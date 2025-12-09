const express = require("express");
const router = express.Router();
const loginControllers = require("../controllers/login.controller");

router.post("/api/employee/login", loginControllers.loginEmployee);
router.post("/api/user/login", loginControllers.logInUser);
module.exports = router;
