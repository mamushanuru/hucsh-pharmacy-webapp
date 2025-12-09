const userService = require("../services/user.service");
const employeeService = require("../services/employee.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET;

const loginEmployee = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First get basic employee info
    const employee = await employeeService.getEmployeeByEmail(email);
    
    if (!employee || employee.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Employee does not exist",
      });
    }

    // Then get full employee details with role
    const employeeWithRole = await employeeService.getEmployeeWithRole(email);
    if (!employeeWithRole || employeeWithRole.length === 0) {
      return res.status(500).json({
        status: "error",
        message: "Employee role missing in DB",
      });
    }

    const hashedPassword = employee[0].employee_password_hashed;
    if (!hashedPassword) {
      return res.status(500).json({
        status: "error",
        message: "Hashed password missing in DB",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        employee_id: employee[0].employee_id,
        employee_email: employee[0].employee_email,
        employee_first_name: employee[0].employee_first_name,
        employee_role: employeeWithRole[0].facility_role_id, // Use the role from joined query
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status: "success",
      message: "Employee logged in successfully",
      data: { 
        employee_token: token,
        employee_id: employee[0].employee_id,
        employee_first_name: employee[0].employee_first_name,
        employee_role: employeeWithRole[0].facility_role_id // Explicitly send role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred during login. Please try again.",
    });
  }
};


async function logInUser(req, res, next) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userService.getUserByEmail(email);
    if (user.length === 0) {
      return res.status(403).json({
        status: "fail",
        message: "User does not exist",
      });
    }

    // Verify the hashed password
    const hashedPassword = user[0].user_password_hashed;
    if (!hashedPassword) {
      return res.status(500).json({
        status: "error",
        message: "Hashed password not found in database.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      return res.status(403).json({
        status: "fail",
        message: "Incorrect password",
      });
    }

    // Generate JWT token
    const payload = {
      user_id: user[0].user_id,
      user_email: user[0].user_email,
      user_first_name: user[0].user_first_name,
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

    // Send response
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: { user_token: token },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred during login. Please try again.",
    });
  }
}

module.exports = { loginEmployee, logInUser };