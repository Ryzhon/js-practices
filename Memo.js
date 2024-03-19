export class Memo {
    constructor(content) {
      this.content = content;
    }

    get summary() {
      return this.content.split("\n")[0];
    }
  }
