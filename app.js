import express from "express";
import status from "express-status-monitor";
import fs from "node:fs";
import zlib from "node:zlib"; // if you want to zip file without memory usages

const PORT = 8000;

const app = express();

app.use(status());

// 1. Reading stream for sample.txt
// 2. zipping chunk data
// 3. writing chunk data in sample.zip
fs.createReadStream("./sample.txt").pipe(
  zlib.createGzip().pipe(fs.createWriteStream("./sample.zip"))
);

app.get("/", (req, res) => {
  // on fronted in response header, we can see Transfer-Encoded: chunked
  const stream = fs.createReadStream("./sample.txt", "utf-8");
  stream.on("data", (chunk) => res.write(chunk));
  stream.on("end", () => res.end());
});

app.listen(PORT, () => {
  console.log(`app is listing on PORT: ${PORT}`);
});
