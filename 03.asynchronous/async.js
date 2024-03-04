import {
  openDatabaseConnection,
  getDatabaseData,
  closeDatabaseConnection,
  runDatabaseQuery,
} from "./db_utils.js";

let db;
let result;

try {
  db = await openDatabaseConnection(":memory:");
  console.log("SQLiteデータベースに接続しました。");
} catch (err) {
  console.error("データベース接続エラー:", err.message);
  throw err;
}
try {
  await runDatabaseQuery(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );
  console.log("テーブルを作成しました。");
} catch (err) {
  console.error("テーブル作成エラー:", err.message);
  throw err;
}
try {
  result = await runDatabaseQuery(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "非同期処理入門",
  );
  console.log(`レコードを挿入しました。ID: ${result.lastID}`);
} catch (err) {
  console.error("レコード挿入エラー:", err.message);
  throw err;
}
try {
  const row = await getDatabaseData(
    db,
    "SELECT * FROM books WHERE id = ?",
    result.lastID,
  );
  console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
} catch (err) {
  console.error("レコード取得エラー:", err.message);
}
try {
  await (db, "DROP TABLE books");
  console.log("テーブルを削除しました。");
} catch (err) {
  console.error("テーブル削除エラー:", err.message);
  throw err;
}
try {
  await closeDatabaseConnection(db);

  console.log("データベース接続を閉じました。");
} catch (err) {
  console.error("データベース接続終了時のエラー:", err.message);
}
