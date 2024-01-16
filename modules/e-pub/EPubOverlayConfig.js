import * as fs from "fs";
import { dirname, join, extname ,resolve } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";


export default class EPubOverlayConfig {

    constructor(properties){

        if(properties == null)
        {
            console.error(chalk.red(`Properties of EPubOverlayConfig is null`));
            throw new Error(`Properties of EPubOverlayConfig is null`);

        }

        if(properties.inputFolderPath == null)
        {
            console.error(chalk.red(`inputFolderPath of EPubOverlayConfig is null`));
            throw new Error(`inputFolderPath of EPubOverlayConfig is null`);

        }

        if(resolve(properties.inputFolderPath) == null){
            console.error(chalk.red(`inputFolderPath of EPubOverlayConfig is not valid`));
            throw new Error(`inputFolderPath of EPubOverlayConfig is not valid`);
        }

        if(!fs.existsSync(resolve(properties.inputFolderPath))){
            console.error(chalk.red(`inputFolderPath of EPubOverlayConfig does not exists`));
            throw new Error(`inputFolderPath of EPubOverlayConfig does not exists`);
        }

        this.inputFolderPath =  resolve(properties.inputFolderPath);


        if(properties.outputFolderPath == null)
        {
            console.error(chalk.red(`outputFolderPath of EPubOverlayConfig is null`));
            throw new Error(`outputFolderPath of EPubOverlayConfig is null`);

        }

        if(resolve(properties.outputFolderPath) == null){
            console.error(chalk.red(`outputFolderPath of EPubOverlayConfig is not valid`));
            throw new Error(`outputFolderPath of EPubOverlayConfig is not valid`);
        }

        if(!fs.existsSync(resolve(properties.outputFolderPath))){
            console.error(chalk.red(`outputFolderPath of EPubOverlayConfig does not exists`));
            throw new Error(`outputFolderPath of EPubOverlayConfig does not exists`);
        }

        this.outputFolderPath =  resolve(properties.outputFolderPath);


        if(properties.filename == null || typeof properties.filename !== "string")
        {
            console.error(chalk.red(`filename of EPubOverlayConfig is null or not string`));
            throw new Error(`filename of EPubOverlayConfig is null or not string`);

        }


        if(extname(properties.filename) !== ".epub"){
            console.error(chalk.red(`filename of EPubOverlayConfig is not valid`));
            throw new Error(`filename of EPubOverlayConfig is not valid`);
        }


        if(!fs.existsSync(join(this.inputFolderPath,properties.filename))){
            console.error(chalk.red(`filename of EPubOverlayConfig does not exists`));
            throw new Error(`filename of EPubOverlayConfig does not exists`);
        }

        this.filename = properties.filename;
        this.inputFullPath = resolve(join(this.inputFolderPath,this.filename));
        this.rawFileName = this.filename.replaceAll(/\W/g, "");
    }
    


}
