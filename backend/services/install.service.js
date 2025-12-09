const conn = require("../config/db.config");
const fs = require("fs");
const path = require("path");

async function install() {
  const queryfile = path.join(__dirname, "sql", "hucsh_service_db.sql");
  console.log("Using SQL file:", queryfile);

  let queries = [];
  let finalMessage = {};
  let templine = "";

  // Read file and split into lines
  const lines = fs.readFileSync(queryfile, "utf-8").split("\n");

  // Build queries list
  lines.forEach((line) => {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith("--") || trimmed === "") {
      return;
    }

    templine += " " + line;

    // End of query
    if (trimmed.endsWith(";")) {
      const sqlQuery = templine.trim();
      queries.push(sqlQuery);
      templine = "";
    }
  });

  console.log("Total queries parsed:", queries.length);

  // Execute queries one by one
  for (let i = 0; i < queries.length; i++) {
    const sql = queries[i];
    try {
      await conn.query(sql);
      console.log(`✅ Query ${i + 1}/${queries.length} executed.`);
    } catch (err) {
      console.log("❌ Err Occurred - Table not created but don't worry, in shaa Allah we fix it.");
      console.error("MySQL error code:", err.code);
      console.error("MySQL error message:", err.sqlMessage);
      console.error("Failing SQL (first 150 chars):", sql.slice(0, 150));
      finalMessage.message = "Not all tables are created";
    }
  }

  if (!finalMessage.message) {
    finalMessage.message = "All tables are created";
    finalMessage.status = 200;
  } else {
    finalMessage.status = 500;
  }

  return finalMessage;
}

module.exports = { install };
