import {
  openDatabaseConnection,
  closeDatabaseConnection,
  runDatabaseQuery,
  getDatabaseData,
} from "./db_utils.js";

let db;

openDatabaseConnection(":memory:")
  .then((newDb) => {
    db = newDb;
    console.log("メモリ内のSQLiteデータベースに接続しました。");
    return runDatabaseQuery(
      newDb,
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    );
  })
  .then(() => {
    console.log("テーブルを作成しました。");
    return runDatabaseQuery(
      db,
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
    );
  })
  .then((result) => {
    console.log(`レコードを挿入しました。ID: ${result.lastID}`);
    return runDatabaseQuery(
      db,
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
    );
  })
  .catch((err) => {
    console.error("二回目レコード挿入エラー:", err.message);
    return getDatabaseData(
      db,
      "SELECT * FROM non_existing_table WHERE id = ?",
      1,
    );
  })
  .catch((err) => {
    console.error("レコード取得エラー:", err.message);
    return runDatabaseQuery(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("テーブルを削除しました。");
    return closeDatabaseConnection(db);
  })
  .then(() => {
    console.log("データベース接続を閉じました。");
  });
