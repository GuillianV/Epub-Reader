import * as fs from "fs";
import { dirname, join, extname, resolve } from "path";
import chalk from "chalk";



export default class EPdfConfig {

    constructor(properties) {

        if (properties == null) {
            console.log(chalk.red("EPdfConfig properties is null"))
            throw new Error("EPdfConfig properties is null")
        }


        if (properties.outputFolderPath == null) {
            console.log(chalk.red("EPdfConfig properties.outputFolderPath is null"))
            throw new Error("EPdfConfig properties.outputFolderPath is null")
        }


        if (typeof properties.outputFolderPath != "string") {
            console.log(chalk.red("EPdfConfig properties.outputFolderPath is not a string"))
            throw new Error("EPdfConfig properties.outputFolderPath is not a string")
        }

        if (fs.existsSync(resolve(properties.outputFolderPath)) == false) {

            console.log(chalk.red("EPdfConfig properties.outputFolderPath does not exist"))
            throw new Error("EPdfConfig properties.outputFolderPath does not exist")
        }

        
        
        fs.mkdirSync(join(properties.outputFolderPath,"pdf"), { recursive: true })
        fs.mkdirSync(join(properties.outputFolderPath,"generated"), { recursive: true })



        this.outputFolderPath = resolve(properties.outputFolderPath)
        this.outputPDFFolderPath = join(this.outputFolderPath, "pdf")
        this.outputGeneratedFolderPath = join(this.outputFolderPath, "generated")

    }



}
