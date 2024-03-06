import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:", () => {
  console.log("メモリ内のSQLiteデータベースに接続しました。");
});

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("テーブルを作成しました。");

    db.run(
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
      function () {
        console.log(`レコードを挿入しました。ID: ${this.lastID}`);
        db.run(
          "INSERT INTO books (title) VALUES (?)",
          "非同期処理入門",
          function (err) {
            if (err) {
              console.error("二回目レコード挿入エラー:", err.message);
            }
            db.get("SELECT * FROM books WHERE id = ?", 999, () => {
              console.log("指定されたIDのレコードは存在しません。");
              db.run("DROP TABLE books", () => {
                console.log("テーブルを削除しました。");
                db.close(() => {
                  console.log("データベース接続を閉じました。");
                });
              });
            });
          },
        );
      },
    );
  },
);
