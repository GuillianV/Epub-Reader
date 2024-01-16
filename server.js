import util from "util";
import express from "express";
import EPubOverlayConfig from "./modules/e-pub/EPubOverlayConfig.js";
import EPubOverlay from "./modules/e-pub/index.js";
import * as fs from "fs";
import { dirname, join, extname, resolve } from "path";
// PORT
const PORT = 3000;

const app = express();

const Main = async () => {
  const EpubConfig = new EPubOverlayConfig({
    filename: "book.epub",
    inputFolderPath: "./input",
    outputFolderPath: "./data",
  });

  const EPubOverlayInstance = new EPubOverlay(EpubConfig);

  await EPubOverlayInstance.init();
  await EPubOverlayInstance.downloadAssets(false);
};


app.use("/book/:book/:fileType/:file", (req, res, next) => {

  const pathAsked = join("./data", req.params.book, req.params.file);
  if (fs.existsSync(pathAsked) == false) {
    res.status(404).send("file not found");
    return;
  }

  express.static(pathAsked)(req, res, next);
});

app.use("/book/:book/:file", (req, res, next) => {
  const pathAsked = join("./data", req.params.book, req.params.file);
  if (fs.existsSync(pathAsked) == false) {
    res.status(404).send("file not found");
    return;
  }

  express.static(pathAsked)(req, res, next);
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

Main();
