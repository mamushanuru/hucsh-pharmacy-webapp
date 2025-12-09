const userService = require("./user.service");
const employeeService = require("./employee.service");
const bcrypt = require("bcrypt");

async function logIn(loginData) {
  try {
    // Try logging in as a user
    let user = await userService.getUserByEmail(loginData.email);
    if (user.length > 0) {
      const isPasswordValid = await bcrypt.compare(loginData.password, user[0].user_password_hashed);
      if (isPasswordValid) {
        return {
          status: "success",
          data: user[0],
        };
      }
    }

    // Try logging in as an employee
    let employee = await employeeService.getEmployeeByEmail(loginData.email);
    if (employee.length > 0) {
      const isPasswordValid = await bcrypt.compare(loginData.password, employee[0].employee_password_hashed);
      if (isPasswordValid) {
        return {
          status: "success",
          data: employee[0],
        };
      }
    }

    // If neither user nor employee login succeeds
    return {
      status: "fail",
      message: "Invalid email or password",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: "error",
      message: "An error occurred during login. Please try again.",
    };
  }
}
const logOut = () => {
  localStorage.removeItem("user_token");
  localStorage.removeItem("employee_token");
  return Promise.resolve(); // Return a resolved promise for consistency
};


module.exports = { logIn,logOut };