import {
  openDatabaseConnection,
  closeDatabaseConnection,
  runDatabaseQuery,
  getDatabaseData,
} from "./db_utils.js";

let dbInstance = null;

openDatabaseConnection(":memory:")
  .then((db) => {
    dbInstance = db;
    console.log("メモリ内のSQLiteデータベースに接続しました。");
  })
  .then(() =>
    runDatabaseQuery(
      dbInstance,
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    ),
  )
  .then(() => console.log("テーブルを作成しました。"))
  .then(() =>
    runDatabaseQuery(
      dbInstance,
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
    ),
  )
  .then((result) => console.log(`レコードを挿入しました。ID: ${result.lastID}`))
  .then(() =>
    runDatabaseQuery(
      dbInstance,
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
    ),
  )
  .catch((err) => console.error("二回目レコード挿入エラー:", err.message))
  .then(() =>
    getDatabaseData(
      dbInstance,
      "SELECT * FROM non_existing_table WHERE id = ?",
      1,
    ),
  )
  .catch((err) => console.error("レコード取得エラー:", err.message))
  .then(() => runDatabaseQuery(dbInstance, "DROP TABLE books"))
  .then(() => console.log("テーブルを削除しました。"))
  .then(() => closeDatabaseConnection(dbInstance))
  .then(() => console.log("データベース接続を閉じました。"));
