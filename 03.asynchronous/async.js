import sqlite3 from "sqlite3";
import { dbRun, dbGet } from "./dbUtils.js";

async function main() {
  const db = new sqlite3.Database(":memory:", (err) => {
    if (err) console.error("データベース接続エラー:", err.message);
    else console.log("メモリ内のSQLiteデータベースに接続しました。");
  });

  try {
    await dbRun(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    );
    console.log("テーブルを作成しました。");

    const result = await dbRun(
      db,
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
    );
    console.log(`レコードを挿入しました。ID: ${result.lastID}`);

    const row = await dbGet(db, "SELECT * FROM books WHERE id = ?", [
      result.lastID,
    ]);
    console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);

    await dbRun(db, "DROP TABLE books");
    console.log("テーブルを削除しました。");
  } catch (err) {
    console.error("エラー発生:", err.message);
  } finally {
    db.close();
    console.log("データベース接続を閉じました。");
  }
}

main();
