import sqlite3 from "sqlite3";
import { dbRun, dbGet } from "./db_utils.js";

async function main() {
  const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      console.error("データベース接続エラー:", err.message);
    } else {
      console.log("メモリ内のSQLiteデータベースに接続しました。");
    }
  });

  try {
    await dbRun(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    );
    console.log("テーブルを作成しました。");

    try {
      const result = await dbRun(
        db,
        "INSERT INTO books (title) VALUES (?)",
        "非同期処理入門",
      );
      console.log(`レコードを挿入しました。ID: ${result.lastID}`);

      await dbRun(db, "INSERT INTO books (title) VALUES (?)", "非同期処理入門");
    } catch (err) {
      console.error("レコード挿入エラー:", err.message);
      try {
        const row = await dbGet(db, "SELECT * FROM books WHERE id = ?", 999);
        if (!row) {
          console.log("指定されたIDのレコードは存在しません。");
        } else {
          console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
        }
      } catch (err) {
        console.error("レコード取得エラー:", err.message);
      }
    }

    try {
      await dbRun(db, "DROP TABLE books");
      console.log("テーブルを削除しました。");
    } catch (err) {
      console.error("テーブル削除エラー:", err.message);
    }
  } finally {
    db.close((err) => {
      if (err) {
        console.error("データベース接続終了エラー:", err.message);
      } else {
        console.log("データベース接続を閉じました。");
      }
    });
  }
}

main();
