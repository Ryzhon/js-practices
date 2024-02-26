import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    throw new Error(`データベース接続エラー:${err.message}`);
  }
  console.log("メモリ内のSQLiteデータベースに接続しました。");
});

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  (err) => {
    if (err) {
      console.error("テーブル作成エラー:", err.message);
      return;
    }
    console.log("テーブルを作成しました。");

    db.run(
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
      function (err) {
        if (err) {
          console.error("初回レコード挿入エラー:", err.message);
        } else {
          console.log(`レコードを挿入しました。ID: ${this.lastID}`);
        }

        db.run(
          "INSERT INTO books (title) VALUES (?)",
          "非同期処理入門",
          function (err) {
            if (err) {
              console.error("二回目レコード挿入エラー:", err.message);
            }

            db.get("SELECT * FROM books WHERE id = ?", 999, (err, row) => {
              if (err) {
                console.error("レコード取得エラー:", err.message);
                throw new Error(`レコード取得エラー:${err.message}`);
              } else if (!row) {
                console.log("指定されたIDのレコードは存在しません。");
              }

              db.run("DROP TABLE books", (err) => {
                if (err) {
                  console.error("テーブル削除エラー:", err.message);
                } else {
                  console.log("テーブルを削除しました。");
                }

                db.close((err) => {
                  if (err) {
                    console.error(`データベース接続終了エラー:${err.message}`);
                  } else {
                    console.log("データベース接続を閉じました。");
                  }
                });
              });
            });
          },
        );
      },
    );
  },
);
