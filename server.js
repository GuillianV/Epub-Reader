import util from "util";
import express from "express";
import EPubOverlayConfig from "./modules/e-pub/EPubOverlayConfig.js";
import EPubOverlay from "./modules/e-pub/EPubOverlay.js";
import * as fs from "fs";
import { dirname, join, extname, resolve } from "path";
import EPdfInstance from "./modules/pdf/EPdfInstance.js";

// PORT
const PORT = 3000;

const app = express();

const Main = async () => {
    const EpubConfig = new EPubOverlayConfig({
        filename: "japon.epub",
        inputFolderPath: "./input",
        outputFolderPath: "./data",
    });

    const EPubOverlayInstance = new EPubOverlay(EpubConfig);

    await EPubOverlayInstance.init();
    await EPubOverlayInstance.downloadAssets(false);

    const chapters = EPubOverlayInstance.chapters()
    const epdfInstance = new EPdfInstance()
    await epdfInstance.init()
    console.log(chapters)
    chapters.forEach(async (chapter) => {

        const path = `http://localhost:${PORT}/book/${chapter.rawFileName}/${chapter.hrefLastPath}`
        const output = join(chapter.outputPath,"pdf",chapter.order+".pdf")
      
        console.log(path)
        epdfInstance.generatePDFfromPage(path,output)
   
    })

    await epdfInstance.close()
    
    await epdfInstance.mergePDFs(join(EpubConfig.outputFolderPath,EpubConfig.rawFileName,"pdf"))

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
