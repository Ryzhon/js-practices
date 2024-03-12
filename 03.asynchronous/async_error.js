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
try {
  await runDatabaseQuery(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "非同期処理入門",
  );
  console.log(`二回目のレコードを挿入しました。ID: ${result.lastID}`);
} catch (err) {
  console.error("二回目レコード取得エラー:", err.message);
  if (err.code !== "SQLITE_CONSTRAINT") {
    throw err;
  }
}
try {
  await getDatabaseData(db, "SELECT * FROM non_existing_table WHERE id = ?", 1);
} catch (err) {
  console.error("レコード取得エラー:", err.message);
  if (err.code !== "SQLITE_ERROR") {
    throw err;
  }
}

await runDatabaseQuery(db, "DROP TABLE books");
console.log("テーブルを削除しました。");
await closeDatabaseConnection(db);
console.log("データベース接続を閉じました。");
