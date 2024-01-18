import util from "util";
import express from "express";
import EPubOverlayConfig from "./modules/e-pub/EPubOverlayConfig.js";
import EPubOverlay from "./modules/e-pub/EPubOverlay.js";
import * as fs from "fs";
import { dirname, join, extname, resolve } from "path";
import EPdfInstance from "./modules/pdf/EPdfInstance.js";
import EPdfConfig from "./modules/pdf/EPdfConfig.js";
import EPdfQueueConfig from "./modules/pdf/EPdfQueueConfig.js";


// PORT
const PORT = 8457;

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

    const chapters = EPubOverlayInstance.chapters()

  
    const epdfInstanceConfig = new EPdfConfig({

        filename: EpubConfig.rawFileName,
        inputFolderPath: join(EpubConfig.outputFolderPath, EpubConfig.rawFileName),
        outputFolderPath: join(EpubConfig.outputFolderPath, EpubConfig.rawFileName),
        forceDownload:false,
        format:"A4",
        landscape:false,
        producer:"GVV",
        author:"GVV",
        title:"My pdf merged",
        finalRawName:"Sipapdf"
    })



    const epdfInstance = new EPdfInstance(epdfInstanceConfig)
    await epdfInstance.init()
    
    chapters.forEach((chapter) => {

        const queueConfig = new EPdfQueueConfig({
            htmlUrl :`http://localhost:${PORT}/book/${chapter.rawFileName}/${chapter.hrefLastPath}`,

            outputFolderPath : epdfInstance.config.outputPDFFolderPath,
            order : chapter.order == null ? chapter.forcedOrder : chapter.order
        })
      
        epdfInstance.loadPDF(queueConfig)
   
    })
    await epdfInstance.downloadPDFsSync()
    await epdfInstance.mergePDFs()
    await epdfInstance.close()

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
