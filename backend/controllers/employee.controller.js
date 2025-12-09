// Import the employee service
const employeeService = require("../services/employee.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create the add employee controller
async function createEmployee(req, res, next) {
  console.log("Request body:", req.body); // Debugging line
  const employeeExists = await employeeService.checkIfEmployeeExists(req.body.employee_email);
  console.log("Employee exists:", employeeExists); // Debugging line

  if (employeeExists) {
    return res.status(400).json({
      error: "This email address is taken",
    });
  }

  try {
    const employeeData = req.body;
    console.log("Creating employee with data:", employeeData); // Debugging line
    const employee = await employeeService.createEmployee(employeeData);

    if (!employee) {
      return res.status(400).json({
        error: "Failed to add the employee!",
      });
    }

    console.log("Employee created successfully:", employee); // Debugging line
    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    console.error("Error in createEmployee controller:", error); // Debugging line
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
}

// Create the getAllEmployees controller
const pool = require("../config/db.config");

async function getAllEmployees(req, res) {
  try {
    const query = `
      SELECT e.*, ei.*, er.facility_role_id, fr.facility_role_name
      FROM employee e
      JOIN employee_info ei ON e.employee_id = ei.employee_id
      JOIN employee_role er ON e.employee_id = er.employee_id
      JOIN facility_roles fr ON er.facility_role_id = fr.facility_role_id
    `;
    const [employees] = await pool.query(query);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllRoles(req, res) {
  try {
    const [roles] = await pool.query("SELECT * FROM facility_roles");
    res.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get employee by email
const getEmployeeByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const employee = await employeeService.getEmployeeByEmail(email);
    if (employee.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee[0]); // Return the first employee in the array
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function updateEmployee(req, res) {
  try {
    const employeeId = req.params.id;
    const updateData = req.body;

    const updatedEmployee = await employeeService.updateEmployee(employeeId, updateData);

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "An error occurred while updating the employee" });
  }
}

// Delete employee controller
async function deleteEmployee(req, res) {
  try {
    const employeeId = req.params.id;

    const deleted = await employeeService.deleteEmployee(employeeId);

    if (!deleted) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "An error occurred while deleting the employee" });
  }
}
// Export the controllers
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeByEmail,
  updateEmployee,
  deleteEmployee,
  getAllRoles,
};