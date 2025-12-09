const express = require("express");
const router = express.Router();

// Import all route files
const installRouter = require("./install.routes");
const employeeRouter = require("./employee.routes");
const loginRoutes = require("./login.routes");
const userRouter = require("./user.routes");
const inventory11Router = require("./inventory11.routes");
const inventory92Router = require("./inventory92.routes"); 
const inventory125Router = require("./inventory125.routes"); 

// Register all routes
router.use(installRouter);
router.use(employeeRouter);
router.use(loginRoutes);
router.use(userRouter);
router.use(inventory11Router);
router.use(inventory92Router); 
router.use(inventory125Router); 

// Export the router
module.exports = router;