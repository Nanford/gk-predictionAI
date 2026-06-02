import "dotenv/config";
import mysql from "mysql2/promise";

const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const assertIdentifier = (name: string, value: string): string => {
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    throw new Error(`${name} may only contain letters, digits, and underscores`);
  }
  return value;
};

const dbName = assertIdentifier("DB_NAME", required("DB_NAME"));
const appUser = assertIdentifier("DB_APP_USER", required("DB_APP_USER"));
const appPassword = required("DB_APP_PASSWORD");

const connection = await mysql.createConnection({
  host: required("MYSQL_ROOT_HOST"),
  port: Number(required("MYSQL_ROOT_PORT")),
  user: required("MYSQL_ROOT_USER"),
  password: required("MYSQL_ROOT_PASSWORD"),
  multipleStatements: false
});

try {
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
  );
  await connection.query(`CREATE USER IF NOT EXISTS ?@'localhost' IDENTIFIED BY ?`, [
    appUser,
    appPassword
  ]);
  await connection.query(`CREATE USER IF NOT EXISTS ?@'127.0.0.1' IDENTIFIED BY ?`, [
    appUser,
    appPassword
  ]);
  await connection.query(`ALTER USER ?@'localhost' IDENTIFIED BY ?`, [appUser, appPassword]);
  await connection.query(`ALTER USER ?@'127.0.0.1' IDENTIFIED BY ?`, [appUser, appPassword]);
  await connection.query(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO ?@'localhost'`, [appUser]);
  await connection.query(`GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO ?@'127.0.0.1'`, [appUser]);
  await connection.query("FLUSH PRIVILEGES");
  console.log(`Database ${dbName} and runtime account ${appUser} are ready.`);
} finally {
  await connection.end();
}
