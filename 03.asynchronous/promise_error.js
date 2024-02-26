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
        return db;
      })
      .catch((err) => {
        console.error("レコード挿入エラー:", err.message);
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
        return db;
      })
      .catch((err) => {
        console.error("二回目レコード挿入エラー:", err.message);
        return db;
      });
  })
  .then((db) => {
    return databaseGet(db, "SELECT * FROM books WHERE id = ?", 999)
      .then((row) => {
        if (!row) {
          console.log("指定されたIDのレコードは存在しません。");
          return db;
        } else {
          console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
        }
      })
      .catch((err) => {
        console.error("レコード取得エラー:", err.message);
      });
  })
  .then((db) => {
    return databaseRun(db, "DROP TABLE books")
      .then(() => {
        console.log("テーブルを削除しました。");
        return db;
      })
      .catch((err) => console.error("テーブル削除エラー:", err.message));
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
