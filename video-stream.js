import express from "express";
import { createReadStream, statSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(`${__dirname}/public/MONONOAWARE.mp4`);

const app = express();

app.get("/video-stream", (req, res) => {
  const filePath = `${__dirname}/public/MONONOAWARE.mp4`;
  const stat = statSync(filePath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Requires Range Headers");
  }

  const chunkSize = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, fileSize);
  const contentLength = end - start + 1;

  // while using stream, user won't able to download it easy
  // you can show caption on video using .vtt file
  const fileStream = createReadStream(filePath, {
    start,
    end,
  });

  fileStream.pipe(res);

  // for more info: pipe alternative

  const header = {
    "Content-Range": `bytes ${start}-${end}/${filePath}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, header); // 206 for partial file
});

app.listen(3001, () => {
  console.log("server is listing...");
});
