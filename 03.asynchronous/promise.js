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
  .then((result) => {
    console.log(`レコードを挿入しました。ID: ${result.lastID}`);
    return result;
  })
  .then((result) =>
    getDatabaseData(
      dbInstance,
      "SELECT * FROM books WHERE id = ?",
      result.lastID,
    ),
  )
  .then((row) =>
    console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`),
  )
  .then(() => runDatabaseQuery(dbInstance, "DROP TABLE books"))
  .then(() => console.log("テーブルを削除しました。"))
  .then(() => closeDatabaseConnection(dbInstance))
  .then(() => console.log("データベース接続を閉じました。"));
