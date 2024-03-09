import {
  openDatabaseConnection,
  closeDatabaseConnection,
  runDatabaseQuery,
  getDatabaseData,
} from "./db_utils.js";

let newDb = undefined;

openDatabaseConnection(":memory:")
  .then((db) => {
    newDb = db;
    console.log("メモリ内のSQLiteデータベースに接続しました。");
    return runDatabaseQuery(
      newDb,
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    );
  })
  .then(() => {
    console.log("テーブルを作成しました。");
    return runDatabaseQuery(
      newDb,
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
    );
  })
  .then((result) => {
    console.log(`レコードを挿入しました。ID: ${result.lastID}`);
    return getDatabaseData(
      newDb,
      "SELECT * FROM books WHERE id = ?",
      result.lastID,
    );
  })
  .then((row) => {
    console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
    return runDatabaseQuery(newDb, "DROP TABLE books");
  })
  .then(() => {
    console.log("テーブルを削除しました。");
    return closeDatabaseConnection(newDb);
  })
  .then(() => console.log("データベース接続を閉じました。"));
