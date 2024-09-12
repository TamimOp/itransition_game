const Crypto = require("./Crypto");
const MoveRules = require("./MoveRules");
const HelpTable = require("./HelpTable");
const readline = require("readline");

class Game {
  constructor(moves) {
    this.moves = moves;
    this.moveCount = moves.length;
    this.crypto = new Crypto();
    this.rules = new MoveRules(moves);
  }

  start() {
    const pcMoveIndex = Math.floor(Math.random() * this.moveCount);
    const pcMove = this.moves[pcMoveIndex];
    const hmac = this.crypto.generateHMAC(pcMove);

    console.log(`HMAC: ${hmac}`);
    this.displayMenu();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askForInput = () => {
      rl.question("Enter your move: ", (userInput) => {
        if (userInput === "0") {
          console.log("Exiting the game...");
          rl.close();
          process.exit(0); // Exit the game
        } else if (userInput === "?") {
          this.showHelp();
          askForInput(); // Keep asking for input after showing help
        } else {
          const userMoveIndex = parseInt(userInput) - 1;
          if (userMoveIndex >= 0 && userMoveIndex < this.moveCount) {
            const userMove = this.moves[userMoveIndex];
            console.log(`Your move: ${userMove}`);
            console.log(`Computer move: ${pcMove}`);
            console.log(this.rules.getResult(userMoveIndex, pcMoveIndex));
            console.log(`HMAC key: ${this.crypto.getKey()}`);
            rl.close();
          } else {
            console.log("Invalid move. Please try again.");
            askForInput(); // Re-prompt after an invalid move
          }
        }
      });
    };

    askForInput(); // Initial prompt
  }

  displayMenu() {
    console.log("Available moves:");
    this.moves.forEach((move, index) => {
      console.log(`${index + 1} - ${move}`);
    });
    console.log("0 - exit");
    console.log("? - help");
  }

  showHelp() {
    const table = new HelpTable(this.moves, this.rules);
    table.display();
  }
}

module.exports = Game;
