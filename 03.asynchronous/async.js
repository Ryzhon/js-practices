import sqlite3 from "sqlite3";
import { databaseRun, databaseGet, closeDatabase } from "./db_utils.js";

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("データベース接続エラー:", err.message);
  } else {
    console.log("メモリ内のSQLiteデータベースに接続しました。");
  }
});

let lastID;

try {
  await databaseRun(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );
  console.log("テーブルを作成しました。");
} catch (err) {
  console.error("テーブル作成エラー:", err.message);
}
try {
  const result = await databaseRun(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "非同期処理入門",
  );
  console.log(`レコードを挿入しました。ID: ${result.lastID}`);
  lastID = result.lastID;
} catch (err) {
  console.error("レコード挿入エラー:", err.message);
}
try {
  const row = await databaseGet(db, "SELECT * FROM books WHERE id = ?", lastID);
  console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
} catch (err) {
  console.error("レコード取得エラー:", err.message);
}
try {
  await (db, "DROP TABLE books");
  console.log("テーブルを削除しました。");
} catch (err) {
  console.error("テーブル削除エラー:", err.message);
} finally {
  await closeDatabase(db)
    .then(() => {
      console.log("データベース接続を閉じました。");
    })
    .catch((err) => {
      console.error("データベース接続終了時のエラー:", err.message);
    });
}
