#!/usr/bin/env node
import fs from "fs";
import readline from "readline";
import { MemoCollection } from "./MemoCollection.js";
import { Storage } from "./Storage.js";

const filePath = "./memos.json";

function main() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
  }

  const memos = Storage.loadMemos(filePath);
  const memoCollection = new MemoCollection(memos);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let content = "";
  const command = process.argv[2];

  switch (command) {
    case "-l":
      memoCollection.listMemos();
      process.exit();
      break;
    case "-r":
      memoCollection.listMemos();
      rl.question("Choose a note you want to see: ", (index) => {
        memoCollection.readMemo(parseInt(index));
        rl.close();
      });
      break;
    case "-d":
      console.log("Choose a note you want to delete:");
      memoCollection.listMemos();
      rl.question("> ", (index) => {
        memoCollection.deleteMemo(parseInt(index));
        Storage.saveMemos(filePath, memoCollection.memos);
        rl.close();
      });
      break;
    default:
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => {
        content += chunk;
      });
      process.stdin.on("end", () => {
        memoCollection.addMemo(content);
        Storage.saveMemos(filePath, memoCollection.memos);
      });
      break;
  }
}

main();
