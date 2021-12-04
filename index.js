const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "words_alpha.txt");

const buffer = fs.readFileSync(filePath, "utf8");
const words = buffer.toString();

console.log(words.split("\r\n"));
