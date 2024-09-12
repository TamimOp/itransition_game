class MoveRules {
  constructor(moves) {
    this.moves = moves;
    this.moveCount = moves.length;
  }

  getResult(userMoveIndex, pcMoveIndex) {
    if (userMoveIndex === pcMoveIndex) {
      return "Draw!";
    }

    const half = Math.floor(this.moveCount / 2);
    const distance =
      (userMoveIndex - pcMoveIndex + this.moveCount) % this.moveCount;

    if (distance <= half) {
      return "You win!";
    } else {
      return "You lose!";
    }
  }
}

module.exports = MoveRules;
