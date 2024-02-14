import sqlite3 from "sqlite3";
import { dbRun, dbGet } from "./dbUtils.js";

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("データベース接続エラー:", err.message);
  } else {
    console.log("メモリ内のSQLiteデータベースに接続しました。");
  }
});

dbRun(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
)
  .then(() =>
    dbRun(db, "INSERT INTO books (title) VALUES (?)", "非同期処理入門"),
  )
  .then((result) => {
    console.log(`レコードを挿入しました。ID: ${result.lastID}`);
    return dbRun(db, "INSERT INTO books (title) VALUES (?)", "非同期処理入門");
  })
  .catch((err) => {
    console.error("レコード挿入エラー:", err.message);
    dbGet(db, "SELECT * FROM books WHERE id = ?", 999);
  })
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
  .finally(() => {
    dbRun(db, "DROP TABLE books")
      .then(() => {
        console.log("テーブルを削除しました。");
      })
      .catch((err) => {
        console.error("テーブル削除エラー:", err.message);
      })
      .finally(() => {
        db.close((err) => {
          if (err) {
            console.error("データベース接続終了エラー:", err.message);
          } else {
            console.log("データベース接続を閉じました。");
          }
        });
      });
  });
