import { Readable } from "node:stream";

const readableStream = new Readable({
  highWaterMark: 2, // It's in bits
  read() {},
});

readableStream.on("data", (chunk) => {
  console.log("data is coming: ", chunk);
  // console.log("data is coming: ", chunk.toString());
});

readableStream.push("Hey m nam is batman");
