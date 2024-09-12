const AsciiTable = require("ascii-table");

class HelpTable {
  constructor(moves, rules) {
    this.moves = moves;
    this.rules = rules;
  }

  display() {
    const table = new AsciiTable();
    table.setHeading(["v PC \\ User >", ...this.moves]);

    this.moves.forEach((pcMove, pcMoveIndex) => {
      const row = [pcMove];
      this.moves.forEach((userMove, userMoveIndex) => {
        if (userMoveIndex === pcMoveIndex) {
          row.push("Draw");
        } else {
          const result = this.rules.getResult(userMoveIndex, pcMoveIndex);
          row.push(result === "You win!" ? "Win" : "Lose");
        }
      });
      table.addRow(row);
    });

    console.log(table.toString());
  }
}

module.exports = HelpTable;
