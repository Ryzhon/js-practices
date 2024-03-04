import { runDatabaseQuery, getDatabaseData } from "./db_utils.js";

export function createBooksTable(db) {
  console.log("SQLiteデータベースに接続しました。");
  return runDatabaseQuery(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  ).then(() => {
    console.log("テーブルを作成しました。");
    return db;
  });
}

export function insertBook(db) {
  return runDatabaseQuery(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "非同期処理入門",
  ).then((result) => {
    console.log(`レコードを挿入しました。ID: ${result.lastID}`);
    return { db, result };
  });
}

export function getBook(db, result) {
  return getDatabaseData(
    db,
    "SELECT * FROM books WHERE id = ?",
    result.lastID,
  ).then((row) => {
    if (!row) {
      console.log("指定されたIDのレコードは存在しません。");
      return db;
    } else {
      console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
    }
  });
}

export function dropBooksTable(db) {
  return runDatabaseQuery(db, "DROP TABLE books").then(() => {
    console.log("テーブルを削除しました。");
    return db;
  });
}
