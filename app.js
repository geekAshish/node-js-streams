import fs, { write } from "node:fs";
import zlib from "node:zlib"; // if you want to zip file without memory usages

import express from "express";
import status from "express-status-monitor";

const PORT = 8000;

const app = express();

app.use(status());

// 1. Reading stream for sample.txt
// 2. zipping data in chunk
// 3. writing chunk data in sample.zip
fs.createReadStream("./sample.txt").pipe(
  zlib.createGzip().pipe(fs.createWriteStream("./sample.zip"))
);

app.get("/", (req, res) => {
  // Downloading file wrong way, file can be any binary
  // const file = fs.readFileSync("./sample.txt");
  // return res.end(file);
  //
  // Downloading file good way
  // on fronted in response header, we can see Transfer-Encoded: chunked
  // const stream = fs.createReadStream("./sample.txt", "utf-8");
  // 1.
  // stream.on("data", (chunk) => res.write(chunk));
  // stream.on("end", () => res.end());
  // 2.
  // stream.pipe(res);


  // copy big file using bad way
  // const file = fs.readFileSync('sample.txt');
  // fs.writeFileSync('output.txt', file);
  // res.end();
  
  
  // copy big file using good way
  const readStream = fs.createReadStream("./sample.txt", "utf-8");
  const writeStream = fs.createWriteStream('./output.txt')

  readStream.on('data', (chunk) => {
    // console.log('chunk: buffer', chunk);
    // console.log('chunk: string', chunk.toString());
     
    writeStream.write(chunk);
  });

  res.end();

});

app.listen(PORT, () => {
  console.log(`app is listing on PORT: ${PORT}`);
});
