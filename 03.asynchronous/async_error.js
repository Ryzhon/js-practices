import {
  databaseRun,
  databaseGet,
  closeDatabase,
  connectToDatabase,
} from "./db_utils.js";

let result;
let db;
try {
  db = await connectToDatabase();
  await databaseRun(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );
  console.log("テーブルを作成しました。");
} catch (err) {
  console.error("テーブル作成エラー:", err.message);
  throw err;
}
try {
  const result = await databaseRun(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "非同期処理入門",
  );
  console.log(`レコードを挿入しました。ID: ${result.lastID}`);
} catch (err) {
  console.error("レコード挿入エラー:", err.message);
  throw err;
}
try {
  await databaseRun(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "非同期処理入門",
  );
  console.log(`二回目のレコードを挿入しました。ID: ${result.lastID}`);
} catch (err) {
  console.error("二回目レコード取得エラー:", err.message);
}

try {
  const row = await databaseGet(db, "SELECT * FROM books WHERE id = ?", 999);
  if (row) {
    console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
  } else {
    console.log("レコードは見つかりませんでした。");
  }
} catch (err) {
  console.error("レコード取得エラー:", err.message);
  throw err;
}
try {
  await databaseRun(db, "DROP TABLE books");
  console.log("テーブルを削除しました。");
} catch (err) {
  console.error("テーブル削除エラー:", err.message);
  throw err;
} finally {
  await closeDatabase(db)
    .then(() => {
      console.log("データベース接続を閉じました。");
    })
    .catch((err) => {
      console.error("データベース接続終了時のエラー:", err.message);
      throw err;
    });
}
