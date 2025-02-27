import { Readable, Writable } from "node:stream";

const readableStream = new Readable({
  // It's in bits, It's threshold not limit, we can push more bits then 2
  // by default 64kb
  highWaterMark: 2,
  read() {},
});

// Writable Stream
const writableStream = new Writable({
  write(s){
    // console.log('writing: ', s);
    console.log('writing: ', s.toString());
  }
});

readableStream.on("data", (chunk) => {
  console.log("data is coming: ", chunk);
  // console.log("data is coming: ", chunk.toString());

  writableStream.write(chunk);
});

const isBufferInHighWaterMark = readableStream.push("Hey m nam is batman");
// isBufferInHighWaterMark, true if below highWaterMar, false if above highWaterMar
console.log(isBufferInHighWaterMark);




