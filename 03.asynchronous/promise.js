import { openDatabaseConnection, closeDatabaseConnection } from "./db_utils.js";
import {
  createBooksTable,
  insertBook,
  getBook,
  dropBooksTable,
} from "./promise_utils.js";

openDatabaseConnection(":memory:")
  .catch((err) => {
    console.error("データベース接続エラー:", err.message);
    throw err;
  })
  .then(createBooksTable)
  .catch((err) => console.error("テーブル作成エラー:", err.message))
  .then(insertBook)
  .catch((err) => console.error("レコード挿入エラー:", err.message))
  .then(({ db, result }) => getBook(db, result))
  .catch((err) => console.error("レコード取得エラー:", err.message))
  .then(dropBooksTable)
  .catch((err) => console.error("テーブル削除エラー:", err.message))
  .then(closeDatabaseConnection)
  .catch((err) => console.error("データベース接続終了エラー:", err.message))
  .then(() => console.log("データベース接続を閉じました。"))
  .catch((err) => console.error(`エラー: ${err.message}`));
