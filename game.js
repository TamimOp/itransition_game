const crypto = require("crypto");
const readline = require("readline");
const AsciiTable = require("ascii-table");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Crypto {
  static generateKey() {
    return crypto.randomBytes(32).toString("hex");
  }

  static generateHMAC(key, message) {
    return crypto.createHmac("sha256", key).update(message).digest("hex");
  }
}

class MoveRules {
  constructor(moves) {
    this.moves = moves;
    this.length = moves.length;
  }

  getWinner(playerMove, pcMove) {
    if (playerMove === pcMove) return "Draw";

    const half = Math.floor(this.length / 2);
    const distance = (pcMove - playerMove + this.length) % this.length;

    return distance <= half ? "You lose!" : "You win!";
  }
}

class HelpTable {
  constructor(moves) {
    this.moves = moves;
    this.rules = new MoveRules(moves);
  }

  displayTable() {
    let table = new AsciiTable("Help Table");
    table.setHeading("v PC/User >", ...this.moves);

    for (let i = 0; i < this.moves.length; i++) {
      const row = [this.moves[i]];
      for (let j = 0; j < this.moves.length; j++) {
        row.push(this.rules.getWinner(i, j));
      }
      table.addRow(...row);
    }

    console.log(table.toString());
  }
}

class Game {
  constructor(moves) {
    if (moves.length < 3 || moves.length % 2 === 0) {
      throw new Error(
        "Please provide an odd number of at least 3 non-repeating moves."
      );
    }
    this.moves = moves;
    this.rules = new MoveRules(moves);
    this.crypto = new Crypto();
    this.help = new HelpTable(moves);
  }

  start() {
    const key = Crypto.generateKey();
    const pcMove = Math.floor(Math.random() * this.moves.length);
    const hmac = Crypto.generateHMAC(key, this.moves[pcMove]);

    console.log("HMAC:", hmac);
    this.displayMenu();

    this.getUserMove((userMove) => {
      if (userMove === "?") {
        this.help.displayTable();
        rl.close();
        return;
      }

      console.log(`Your move: ${this.moves[userMove]}`);
      console.log(`Computer move: ${this.moves[pcMove]}`);
      console.log(this.rules.getWinner(userMove, pcMove));
      console.log("HMAC key:", key);
      rl.close();
    });
  }

  displayMenu() {
    console.log("Available moves:");
    this.moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log("0 - exit\n? - help");
  }

  getUserMove(callback) {
    rl.question("Enter your move: ", (input) => {
      if (input === "0") {
        console.log("Exiting...");
        rl.close();
        process.exit(0);
      } else if (input === "?") {
        callback("?");
      } else {
        const userMove = parseInt(input) - 1;
        if (userMove >= 0 && userMove < this.moves.length) {
          callback(userMove);
        } else {
          console.log("Invalid input, please try again.");
          this.getUserMove(callback);
        }
      }
    });
  }
}

// Command-line arguments validation
const moves = process.argv.slice(2);
try {
  const game = new Game(moves);
  game.start();
} catch (err) {
  console.error(err.message);
  console.log("Usage: node game.js [move1 move2 move3 ...]");
  console.log("Example: node game.js rock paper scissors");
}
