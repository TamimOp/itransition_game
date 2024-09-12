const crypto = require("node:crypto");
const KEY_LENGTH = 32;

class Crypto {
  constructor() {
    this.key = crypto.randomBytes(KEY_LENGTH).toString("hex");
  }

  generateHMAC(message) {
    const hmac = crypto.createHmac("sha3-256", this.key);
    hmac.update(message);
    return hmac.digest("hex");
  }

  getKey() {
    return this.key;
  }
}

module.exports = Crypto;
