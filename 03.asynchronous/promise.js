import { openDatabaseConnection, closeDatabaseConnection } from "./db_utils.js";
import {
  createBooksTable,
  insertBook,
  getBook,
  dropBooksTable,
} from "./promise_utils.js";

let dbInstance = null;

openDatabaseConnection(":memory:")
  .catch((err) => {
    console.error("データベース接続エラー:", err.message);
    throw err;
  })
  .then((db) => {
    dbInstance = db;
    console.log("SQLiteデータベースに接続しました。");
    return createBooksTable(dbInstance);
  })
  .catch((err) => console.error("テーブル作成エラー:", err.message))
  .then(() => {
    console.log("テーブルを作成しました。");
    return insertBook(dbInstance);
  })
  .catch((err) => console.error("レコード挿入エラー:", err.message))
  .then((result) => {
    console.log(`レコードを挿入しました。ID: ${result.lastID}`);
    return getBook(dbInstance, result);
  })
  .catch((err) => console.error("レコード取得エラー:", err.message))
  .then((row) => {
    if (!row) {
      console.log("指定されたIDのレコードは存在しません。");
    } else {
      console.log(`取得したレコード: ID: ${row.id}, Title: ${row.title}`);
    }
    return dropBooksTable(dbInstance);
  })
  .catch((err) => console.error("テーブル削除エラー:", err.message))
  .then(() => {
    console.log("テーブルを削除しました。");
    return closeDatabaseConnection(dbInstance);
  })
  .catch((err) => console.error("データベース接続終了エラー:", err.message))
  .then(() => console.log("データベース接続を閉じました。"))
  .catch((err) => console.error(`エラー: ${err.message}`));
