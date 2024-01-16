import { dirname, join, extname, resolve } from "path";
import EPubOverlayConfig from "./EPubOverlayConfig.js";
export default class ManifestItem {
  constructor(item, ePubOverlayConfig) {
    if (item == null) {
      console.error(chalk.red(`item of ManifestItem is null`));
      throw new Error(`item of ManifestItem is null`);
    }

    if (ePubOverlayConfig == null) {
      console.error(chalk.red(`ePubOverlayConfig of ManifestItem is null`));
      throw new Error(`ePubOverlayConfig of ManifestItem is null`);
    }

    if (ePubOverlayConfig instanceof EPubOverlayConfig == false) {
      console.error(
        chalk.red(
          `ePubOverlayConfig of ManifestItem is not an instance of EPubOverlayConfig`
        )
      );
      throw new Error(
        `ePubOverlayConfig of ManifestItem is not an instance of EPubOverlayConfig`
      );
    }

    if (item.mediaType == null) {
      console.error(chalk.red(`mediaType of ManifestItem is null`));
      throw new Error(`mediaType of ManifestItem is null`);
    }

    if (item.href == null) {
      console.error(chalk.red(`href of ManifestItem is null`));
      throw new Error(`href of ManifestItem is null`);
    }

    if (item.id == null) {
      console.error(chalk.red(`id of ManifestItem is null`));
      throw new Error(`id of ManifestItem is null`);
    }

    const hrefPaths = item.href.split("/");
    const hrefLastPath = hrefPaths[hrefPaths.length - 1];
    const media = item.mediaType.split("/");
    const outputPath = join(
      ePubOverlayConfig.outputFolderPath,
      ePubOverlayConfig.rawFileName,
    );
    const outputFullPath = join(
      outputPath,
      hrefLastPath
    );

    this.type = media[0]
    this.extension= extname(hrefLastPath)
    this.rawFileName= ePubOverlayConfig.rawFileName
    this.id= item.id
    this.href= item.href
    this.hrefPaths = hrefPaths
    this.mimeType= item.mediaType
    this.hrefLastPath = hrefLastPath
    this.outputPath = outputPath
    this.outputFullPath = outputFullPath
  
  }

}
