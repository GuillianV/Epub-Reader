import * as fs from "fs";
import { dirname, join, extname, resolve } from "path";
import chalk from "chalk";

export default class EPdfConfig {
  constructor(properties) {
    if (properties == null) {
      console.log(chalk.red("EPdfConfig properties is null"));
      throw new Error("EPdfConfig properties is null");
    }

    if (properties.outputFolderPath == null) {
      console.log(chalk.red("EPdfConfig properties.outputFolderPath is null"));
      throw new Error("EPdfConfig properties.outputFolderPath is null");
    }

    if (typeof properties.outputFolderPath != "string") {
      console.log(
        chalk.red("EPdfConfig properties.outputFolderPath is not a string")
      );
      throw new Error("EPdfConfig properties.outputFolderPath is not a string");
    }

    if (fs.existsSync(resolve(properties.outputFolderPath)) == false) {
      console.log(
        chalk.red("EPdfConfig properties.outputFolderPath does not exist")
      );
      throw new Error("EPdfConfig properties.outputFolderPath does not exist");
    }

    fs.mkdirSync(join(properties.outputFolderPath, "pdf"), { recursive: true });
    fs.mkdirSync(join(properties.outputFolderPath, "generated"), {
      recursive: true,
    });

    this.outputFolderPath = resolve(properties.outputFolderPath);
    this.outputPDFFolderPath = join(this.outputFolderPath, "pdf");
    this.outputGeneratedFolderPath = join(this.outputFolderPath, "generated");

    this.pdfConfig = {};
    this.pdfConfig.forceDownload =
      properties.forceDownload != null ? properties.forceDownload : false;

    /*
        Letter: 8.5in x 11in
        Legal: 8.5in x 14in
        Tabloid: 11in x 17in
        Ledger: 17in x 11in
        A0: 33.1in x 46.8in
        A1: 23.4in x 33.1in
        A2: 16.54in x 23.4in
        A3: 11.7in x 16.54in
        A4: 8.27in x 11.7in
        A5: 5.83in x 8.27in
        A6: 4.13in x 5.83in
      */
    this.pdfConfig.format =
      properties.format != null ? properties.format : "A4";

    this.pdfConfig.landscape = properties.landscape != null ? properties.landscape : false;
    this.metadata = {}

    this.metadata.producer = properties.producer != null ? properties.producer : "EPdf"
    this.metadata.author = properties.author != null ? properties.author : "EPdf"
    this.metadata.title = properties.title != null ? properties.title : "EPdf"
    this.metadata.creator = properties.creator != null ? properties.creator : "EPdf"
    this.metadata.finalRawName =  properties.finalRawName != null ? properties.finalRawName : "merged"


  }
}
