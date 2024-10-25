import { Memo } from "./Memo.js";

export class MemoCollection {
  constructor(memos) {
    this.memos = memos;
  }

  addMemo(content) {
    this.memos.push(new Memo(content));
    console.log("Added");
  }

  listMemos() {
    this.memos.forEach((memo, index) => {
      console.log(`${index + 1}: ${memo.summary}`);
    });
  }

  readMemo(index) {
    if (index >= 1 && index <= this.memos.length) {
      console.log(this.memos[index - 1].content);
    } else {
      console.log("Invalid memo number.");
    }
  }

  deleteMemo(index) {
    if (index >= 1 && index <= this.memos.length) {
      this.memos.splice(index - 1, 1);
      console.log("Deleted");
    } else {
      console.log("Invalid memo number.");
    }
  }
}
