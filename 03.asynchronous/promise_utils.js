import { runDatabaseQuery, getDatabaseData } from "./db_utils.js";

export function createBooksTable(db) {
  return runDatabaseQuery(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );
}

export function insertBook(db) {
  return runDatabaseQuery(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "非同期処理入門",
  );
}

export function getBook(db, result) {
  return getDatabaseData(db, "SELECT * FROM books WHERE id = ?", result.lastID);
}

export function dropBooksTable(db) {
  return runDatabaseQuery(db, "DROP TABLE books").then(() => {
    return db;
  });
}
