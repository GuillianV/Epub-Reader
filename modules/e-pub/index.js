import { EPub } from "epub2";
import * as fs from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

import EPubOverlayConfig from "./EPubOverlayConfig.js";
import ManifestItem from "./ManifestItem.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, "data");
const inputPath = join(__dirname, "input");

export default class EPubOverlay {
  constructor(ePubOverlayConfig = null) {
    if (ePubOverlayConfig == null) {
      console.error(chalk.red(`ePubOverlayConfig is null`));
      throw new Error(`ePubOverlayConfig is null`);
    }

    if (ePubOverlayConfig instanceof EPubOverlayConfig == false) {
      console.error(
        chalk.red(`ePubOverlayConfig is not an instance of EPubOverlayConfig`)
      );
      throw new Error(
        `ePubOverlayConfig is not an instance of EPubOverlayConfig`
      );
    }

    this.config = ePubOverlayConfig;
    this.isInitialized = false;
    this.isLoaded = false;
    this.manifestItems = [];
  }

  async init() {
    try {
      this.epub = await EPub.createAsync(this.config.inputFullPath);
      this.isInitialized = true;
      this._loadManifest();
      this.isLoaded = true;
    } catch (error) {
      console.error(chalk.red(error));
    }
  }

  async _loadManifest() {
    if (this.isInitialized == false) {
      console.error(chalk.red(`EPubOverlay is not initialized`));
      return;
    }

    const items = Object.values(this.epub.manifest);
    for (let i = 0; i <items.length ; i++) {
      const item = items[i];
      const itemData = new ManifestItem(item, this.config);
      this.manifestItems.push(itemData);
    }
  }

  async downloadAssets(force = false) {
    if (this.isLoaded == false) {
      console.error(chalk.red(`EPubOverlay is not loaded. init() first`));
      return;
    }

    for (let i = 0; i < this.manifestItems.length; i++) {
      const item = this.manifestItems[i];
      await this._downloadAsset(item,force);
    }
  }

  async _downloadAsset(item, force = false) {
    try {
      if (item == null || item instanceof ManifestItem == false) {
        console.error(chalk.red(`item is not an instance of ManifestItem`));
        throw new Error(`item is not an instance of ManifestItem`);
      }

      if (fs.existsSync(item.outputPath) == false)
        fs.mkdirSync(item.outputPath, {
          recursive: true,
        });

    
      if (fs.existsSync(item.outputFullPath) == true && force == false) return;


      console.log(`Downloading ${item.hrefLastPath}...`);

      const result = await this.epub.getFileAsync(item.id);
      fs.writeFileSync(item.outputFullPath, result[0]);
    } catch (error) {
      console.error(chalk.red(error));
    }
  }
}
