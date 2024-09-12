const Game = require("./Game");

const args = process.argv.slice(2);

if (args.length < 3 || args.length % 2 === 0) {
  console.error(
    "Error: Provide an odd number of at least 3 non-repeating moves."
  );
  console.log("Example: node index.js rock paper scissors");
  process.exit(1);
}

const game = new Game(args);
game.start();
