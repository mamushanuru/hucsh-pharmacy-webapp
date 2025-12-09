// Import the pool object from db.config.js
const { pool } = require("../config/db.config"); // Add this line
const bcrypt = require("bcrypt");

// A function to check if employee exists in the database
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ?";
  const [rows] = await pool.query(query, [email]); // Use pool.query
  console.log(rows); // Debugging line
  return rows.length > 0;
}

// A function to create a new employee
async function createEmployee(employee) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start a transaction

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);

    // Insert the email into the employee table
    const [employeeResult] = await connection.query(
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)",
      [employee.employee_email, employee.active_employee]
    );

    if (employeeResult.affectedRows !== 1) {
      throw new Error("Failed to insert into employee table");
    }

    // Get the employee_id from the insert
    const employee_id = employeeResult.insertId;

    // Insert the remaining data into the employee_info table
    const [employeeInfoResult] = await connection.query(
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)",
      [employee_id, employee.employee_first_name, employee.employee_last_name, employee.employee_phone]
    );

    if (employeeInfoResult.affectedRows !== 1) {
      throw new Error("Failed to insert into employee_info table");
    }

    // Insert the hashed password into the employee_pass table
    const [employeePassResult] = await connection.query(
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)",
      [employee_id, hashedPassword]
    );

    if (employeePassResult.affectedRows !== 1) {
      throw new Error("Failed to insert into employee_pass table");
    }

    // Insert the role into the employee_role table
    const [employeeRoleResult] = await connection.query(
      "INSERT INTO employee_role (employee_id, facility_role_id) VALUES (?, ?)",
      [employee_id, employee.facility_role_id]
    );

    if (employeeRoleResult.affectedRows !== 1) {
      throw new Error("Failed to insert into employee_role table");
    }

    // Commit the transaction
    await connection.commit();

    // Return the employee object
    return { employee_id };
  } catch (err) {
    // Rollback the transaction in case of error
    if (connection) await connection.rollback();
    console.error("Error creating employee:", err);
    throw err; // Re-throw the error to be handled by the controller
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
}

// A function to get an employee by email
async function getEmployeeByEmail(employee_email) {
  const query = `
    SELECT * FROM employee 
    INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id 
    INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id 
    WHERE employee.employee_email = ?
  `;
  const [rows] = await pool.query(query, [employee_email]); // Use pool.query
  return rows;
}

async function updateEmployee(employeeId, updateData) {
  const query = `
    UPDATE employee_info
    SET employee_first_name = ?, employee_last_name = ?, employee_phone = ?
    WHERE employee_id = ?
  `;
  const [result] = await pool.query(query, [
    updateData.employee_first_name,
    updateData.employee_last_name,
    updateData.employee_phone,
    employeeId,
  ]);

  return result.affectedRows > 0;
}

// Delete employee service
async function deleteEmployee(employeeId) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Delete from employee_pass
    await connection.query("DELETE FROM employee_pass WHERE employee_id = ?", [employeeId]);
    
    // Delete from employee_role
    await connection.query("DELETE FROM employee_role WHERE employee_id = ?", [employeeId]);
    
    // Delete from employee_info
    await connection.query("DELETE FROM employee_info WHERE employee_id = ?", [employeeId]);
    
    // Finally delete from employee
    const [result] = await connection.query("DELETE FROM employee WHERE employee_id = ?", [employeeId]);
    
    await connection.commit();
    return result.affectedRows > 0;
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error deleting employee:", err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
}
// Update in employee.service.js
async function getAllEmployees() {
  const query = `
    SELECT e.*, ei.*, er.facility_role_id
    FROM employee e
    JOIN employee_info ei ON e.employee_id = ei.employee_id
    JOIN employee_role er ON e.employee_id = er.employee_id
  `;
  const [rows] = await pool.query(query);
  return rows;
}

async function getEmployeeWithRole(email) {
  const query = `
    SELECT e.*, ei.*, er.facility_role_id, fr.facility_role_name
    FROM employee e
    JOIN employee_info ei ON e.employee_id = ei.employee_id
    JOIN employee_role er ON e.employee_id = er.employee_id
    JOIN facility_roles fr ON er.facility_role_id = fr.facility_role_id
    WHERE e.employee_email = ?
  `;
  const [rows] = await pool.query(query, [email]);
  return rows;
}
// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeWithRole,
};