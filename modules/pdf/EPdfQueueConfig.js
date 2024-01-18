import * as fs from "fs";
import { dirname, join, extname, resolve } from "path";
import chalk from "chalk";

export default class EPdfQueueConfig {
  constructor(properties) {

    this.htmlUrl = properties.htmlUrl
    this.outputFolderPath = properties.outputFolderPath
    this.order = properties.order
    
  }
}
