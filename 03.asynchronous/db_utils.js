import sqlite3 from "sqlite3";

export function dbRun(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ ...this });
      }
    });
  });
}

export function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export function connectToDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(":memory:", (err) => {
      if (err) {
        console.error("データベース接続エラー:", err.message);
        reject(err);
      } else {
        console.log("メモリ内のSQLiteデータベースに接続しました。");
        resolve(db);
      }
    });
  });
}
