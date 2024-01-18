import puppeteer from "puppeteer";
import PDFMerger from "pdf-merger-js";
import EPdfConfig from "./EPdfConfig.js";
import EventEmitter from "../utils/event-emmiter.js";
import fs from "fs";
import { join, resolve } from "path";
import EPdfQueueConfig from "./EPdfQueueConfig.js";
let instance = null;

export default class EPdfInstance extends EventEmitter {
  constructor(ePdfConfig) {
    super();

    if (instance !== null) {
      return instance;
    }
    instance = this;

    if (ePdfConfig == null) {
      console.log(chalk.red("EPdfConfig properties is null"));
      throw new Error("EPdfConfig properties is null");
    }

    if (ePdfConfig instanceof EPdfConfig == false) {
      console.log(
        chalk.red("EPdfConfig properties is not an instance of EPdfConfig")
      );
      throw new Error("EPdfConfig properties is not an instance of EPdfConfig");
    }

    this.config = ePdfConfig;
    this.queue = [];
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: "new",
    });
  }

  async close() {
    if (this.browser != null) {
      await this.browser.close();
      this.browser = null;
    }
  }

  loadPDF(queueConfig) {
    if (queueConfig == null) {
      console.log(chalk.red("EPdfQueueConfig properties is null"));
      throw new Error("EPdfQueueConfig properties is null");
    }

    if (queueConfig instanceof EPdfQueueConfig == false) {
      console.log(
        chalk.red(
          "EPdfQueueConfig properties is not an instance of EPdfQueueConfig"
        )
      );
      throw new Error(
        "EPdfQueueConfig properties is not an instance of EPdfQueueConfig"
      );
    }

    this.queue.push(queueConfig);
  }

  _queue() {
    return new Promise(async (resolve, reject) => {
      if (this.queue.length > 0) {
        const queueConfig = this.queue.shift();
        await this._generatePDFfromPage(queueConfig);
        await this._queue().then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  async downloadPDFsSync() {
    console.log("Download pdfs from Html started...");
    await this._queue();
    console.log("Download end...");
  }

  async downloadPDFs(callback) {
    if (callback == null || typeof callback != "function") {
      console.log(chalk.red("callback is not a function"));
      throw new Error("callback is not a function");
    }

    console.log("Download pdfs from Html started...");
    await this._queue();
    console.log("Download end...");
    callback();
  }

  async _generatePDFfromPage(params) {
    const { format, landscape, forceDownload } = this.config.pdfConfig;
    const { htmlUrl, outputFolderPath, order } = params;

    const fullpath = join(outputFolderPath, `${order.toString().padStart("5","0")}.pdf`);

    if (fs.existsSync(fullpath) == true && forceDownload == false) return;

    console.log(`Generating PDF n°${order}...`);
    const page = await this.browser.newPage();
    await page.goto(htmlUrl);
    await page.pdf({ path: fullpath, format, landscape });
  }

  async mergePDFs() {
    console.log("Merge started...");

    const {outputPDFFolderPath, outputGeneratedFolderPath} = this.config
    const {producer, author, creator, title, finalRawName} = this.config.metadata

    var merger = new PDFMerger();
    const filenames = fs.readdirSync(resolve(outputPDFFolderPath));



    function _addPage() {
      return new Promise(async (resolve, reject) => {
        if (filenames.length > 0) {
          const filename = filenames.shift();
          console.log(`Merging PDF ${filename}...`);
          await merger.add(join(outputPDFFolderPath, filename));
          await _addPage().then(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    }

    await _addPage();
    console.log("Merge Ended, start saving...");

    await merger.setMetadata({
      producer,
      author,
      creator,
      title,
    });

    await merger.save(`${finalRawName}.pdf`); 
    const mergedPdfBuffer = await merger.saveAsBuffer();
    fs.writeFileSync(
      join(outputGeneratedFolderPath, `${finalRawName}.pdf`),
      mergedPdfBuffer
    );

    console.log(`PDF ${finalRawName} Generated !`);
  }
}
