const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const roleAuthorization = require("../middlewares/role.middleware");

router.post("/api/employee", roleAuthorization(["Manager", 1]), employeeController.createEmployee);
router.get("/api/employees", roleAuthorization(["Manager", 1]), employeeController.getAllEmployees);
router.get("/api/roles", roleAuthorization(["Manager", 1]), employeeController.getAllRoles);
router.get("/api/employee", roleAuthorization(["Manager", 1]), employeeController.getEmployeeByEmail);
router.put("/api/employee/:id", roleAuthorization(["Manager", 1]), employeeController.updateEmployee);
router.delete("/api/employee/:id", roleAuthorization(["Manager", 1]), employeeController.deleteEmployee);

module.exports = router;