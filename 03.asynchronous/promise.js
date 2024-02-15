import { connectToDatabase, closeDatabase } from "./db_utils.js";
import { dbRun, dbGet } from "./db_utils.js";

connectToDatabase()
  .then((db) => {
    return dbRun(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    )
      .then(() =>
        dbRun(db, "INSERT INTO books (title) VALUES (?)", "非同期処理入門"),
      )
      .catch((err) => {
        console.error("初回レコード挿入エラー:", err.message);
      })
      .then((result) => {
        console.log(`レコードを挿入しました。ID: ${result.lastID}`);
        return dbGet(db, "SELECT * FROM books WHERE id = ?", result.lastID);
      })
      .catch((err) => {
        console.error("レコード挿入エラー:", err.message);
        return Promise.resolve();
      })
      .then((row) => {
        console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
        return dbRun(db, "DROP TABLE books");
      })
      .then(() => {
        console.log("テーブルを削除しました。");
      })
      .catch((err) => {
        console.error("テーブル削除エラー:", err.message);
      })
      .finally(() => {
        closeDatabase(db).catch((err) => {
          console.error("データベース接続終了エラー:", err.message);
        });
      });
  })
  .catch((err) => {
    console.error("データベース接続エラー:", err.message);
  });
