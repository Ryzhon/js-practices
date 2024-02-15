import { connectToDatabase, closeDatabase } from "./db_utils.js";
import { dbRun, dbGet } from "./db_utils.js";

connectToDatabase()
  .then((db) => {
    dbRun(
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
        return dbRun(
          db,
          "INSERT INTO books (title) VALUES (?)",
          "非同期処理入門",
        );
      })
      .catch((err) => {
        console.error("二回目レコード挿入エラー:", err.message);
        return Promise.resolve();
      })
      .then(() => dbGet(db, "SELECT * FROM books WHERE id = ?", 999))
      .then((row) => {
        if (!row) {
          console.log("指定されたIDのレコードは存在しません。");
        } else {
          console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
        }
      })
      .catch((err) => {
        console.error("レコード取得エラー:", err.message);
      })
      .then(() => {
        dbRun(db, "DROP TABLE books");
      })
      .catch((err) => console.error("テーブル削除エラー:", err.message))
      .finally(() => {
        closeDatabase(db).catch((err) => {
          console.error("データベース接続終了エラー:", err.message);
        });
      });
  })
  .catch((err) => {
    console.error("データベース接続エラー:", err.message);
  });
