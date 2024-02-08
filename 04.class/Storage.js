import fs from "fs";
import { Memo } from "./Memo.js";

export class Storage {
  static loadMemos(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const memoContents = JSON.parse(data);
      return memoContents.map((content) => new Memo(content));
    } else {
      return [];
    }
  }

  static saveMemos(filePath, memos) {
    const memoContents = memos.map((memo) => memo.content);
    const data = JSON.stringify(memoContents, null, 2);
    fs.writeFileSync(filePath, data);
  }
}
