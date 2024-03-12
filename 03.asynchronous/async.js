import {
  openDatabaseConnection,
  closeDatabaseConnection,
  runDatabaseQuery,
  getDatabaseData,
} from "./db_utils.js";

let db;

db = await openDatabaseConnection(":memory:");
console.log("SQLiteデータベースに接続しました。");

await runDatabaseQuery(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
);
console.log("テーブルを作成しました。");

const result = await runDatabaseQuery(
  db,
  "INSERT INTO books (title) VALUES (?)",
  "非同期処理入門",
);
console.log(`レコードを挿入しました。ID: ${result.lastID}`);

const row = await getDatabaseData(
  db,
  "SELECT * FROM books WHERE id = ?",
  result.lastID,
);
console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);

await (db, "DROP TABLE books");
console.log("テーブルを削除しました。");
await closeDatabaseConnection(db);
console.log("データベース接続を閉じました。");
