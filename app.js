import fs from "node:fs";
import zlib from "node:zlib"; // if you want to zip file without memory usages

import express from "express";
import status from "express-status-monitor";
import { pipeline, Transform } from "node:stream";

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

app.get('/string-processing', (req, res) => {
  const sampleFileStream = fs.createReadStream('sample.txt');
  const outputWritableStream = fs.createReadStream('output.txt');

  // 1.
  sampleFileStream.on('data', (chunk) => {
    // processing
    const finalString = chunk.toString().replaceAll(/ipsum/gi, 'cool').toUpperCase();

    // writable stream write
    outputWritableStream.write(finalString);
  })

  // 2.
  sampleFileStream.pipe(outputWritableStream)

  // 3. using transform
  const replaceWordProcessing = new Transform({
    transform(chunk, encoding, callback) {
      replaceWordProcessing.emit('error', new Error('Something went wrong!'))
      const finalString = chunk.toString().replaceAll(/ipsum/gi, 'cool');
      callback(null, finalString);
    }
  })
  const upperCaseWordProcessing = new Transform({
    transform(chunk, encoding, callback) {
      const finalString = chunk.toString().toUpperCase();
      callback(null, finalString);
    }
  })

  // i. pipe
  // sampleFileStream
  //   .pipe(replaceWordProcessing)
  //   .on('error', (err) => {
  //     console.log(err);
      
  //   })
  //   .pipe(upperCaseWordProcessing)
  //   .pipe(outputWritableStream);

  // or ii. pipeline
  pipeline(
    sampleFileStream,
    replaceWordProcessing,
    upperCaseWordProcessing,
    outputWritableStream,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  )

})

app.listen(PORT, () => {
  console.log(`app is listing on PORT: ${PORT}`);
});
