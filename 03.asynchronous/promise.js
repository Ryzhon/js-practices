import {
  connectToDatabase,
  closeDatabase,
  databaseRun,
  databaseGet,
} from "./db_utils.js";

connectToDatabase()
  .then((db) => {
    console.log("SQLiteデータベースに接続しました。");
    return databaseRun(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    )
      .then(() => {
        console.log("テーブルを作成しました。");
        return db;
      })
      .catch((err) => {
        console.error("テーブル作成エラー:", err.message);
      });
  })
  .then((db) => {
    return databaseRun(
      db,
      "INSERT INTO books (title) VALUES (?)",
      "非同期処理入門",
    )
      .then((result) => {
        console.log(`レコードを挿入しました。ID: ${result.lastID}`);
        return { db, result };
      })
      .catch((err) => {
        console.error("レコード挿入エラー:", err.message);
      });
  })
  .then(({ db, result }) => {
    return databaseGet(db, "SELECT * FROM books WHERE id = ?", result.lastID)
      .then((row) => {
        console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
        return db;
      })
      .catch((err) => {
        console.error("レコード挿入エラー:", err.message);
      });
  })
  .then((db) => {
    return databaseRun(db, "DROP TABLE books")
      .then(() => {
        console.log("テーブルを削除しました。");
        return db;
      })
      .catch((err) => {
        console.error("テーブル削除エラー:", err.message);
      });
  })
  .then((db) => {
    return closeDatabase(db)
      .then(() => {
        console.log("データベース接続を閉じました。");
      })
      .catch((err) => {
        console.error("データベース接続終了エラー:", err.message);
      });
  })
  .catch((err) => {
    console.error("データベース接続エラー:", err.message);
  });
