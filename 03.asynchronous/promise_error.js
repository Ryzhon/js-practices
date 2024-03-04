import { openDatabaseConnection, closeDatabaseConnection } from "./db_utils.js";
import {
  createBooksTable,
  insertBook,
  getBook,
  dropBooksTable,
} from "./promise_utils.js";

let dbInstance = null;
openDatabaseConnection(":memory:")
  .then((db) => {
    dbInstance = db;
    return createBooksTable(db);
  })
  .catch((err) => console.error("テーブル作成エラー:", err.message))
  .then(() => insertBook(dbInstance))
  .catch((err) => console.error("レコード挿入エラー:", err.message))
  .then(() => insertBook(dbInstance))
  .catch((err) => console.error("二回目レコード挿入エラー:", err.message))
  .then(() => {
    const fakeResult = { lastID: 999 };
    return getBook(dbInstance, fakeResult);
  })
  .catch((err) => console.error("レコード取得エラー:", err.message))
  .then(() => dropBooksTable(dbInstance))
  .catch((err) => console.error("テーブル削除エラー:", err.message))
  .then(() => {
    if (dbInstance) {
      closeDatabaseConnection(dbInstance)
        .then(() => console.log("データベース接続を閉じました。"))
        .catch((err) =>
          console.error("データベース接続終了エラー:", err.message),
        );
    }
  });
