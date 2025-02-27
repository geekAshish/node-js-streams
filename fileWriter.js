import fs from "node:fs";

// const writableStream = fs.createWriteStream("log.txt");
// process.stdin.pipe(writableStream); // writing data from CLI to file

// reading data from file to CLI
const readableStream = fs.createReadStream("log.txt");
readableStream.pipe(process.stdout);
