import puppeteer from 'puppeteer';
import PDFMerger from 'pdf-merger-js';
import EPdfConfig from './EPdfConfig.js';
import fs from 'fs';
import { join, resolve } from 'path';
let instance = null


export default class EPdfInstance {

    constructor(ePdfConfig) {
        if (instance !== null) {
            return instance
        }
        instance = this

        if (ePdfConfig == null) {
            console.log(chalk.red("EPdfConfig properties is null"))
            throw new Error("EPdfConfig properties is null")
        }

        if (ePdfConfig instanceof EPdfConfig == false) {
            console.log(chalk.red("EPdfConfig properties is not an instance of EPdfConfig"))
            throw new Error("EPdfConfig properties is not an instance of EPdfConfig")
        }

        this.config = ePdfConfig
        this.queue = []
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: "new"
        });
    }

    async close() {
        if (this.browser != null) {
            await this.browser.close()
            this.browser = null
        }

    }

    _queue() {

        return new Promise(async (resolve, reject) => {

            if (this.queue.length > 0) {
                const params = this.queue.shift()
                await this.generatePDFfromPage({ ...params, outputPDFFolderPath: this.config.outputPDFFolderPath })
                await this._queue().then(() => {
                    resolve()
                })
            }else{
           
                resolve()
            }
                
        })

    }


    async startQueueSync() {

        await this._queue()
       
    }

    async startQueue(callback) {

        if(callback == null || typeof callback != "function")
        {
            console.log(chalk.red("callback is not a function"))
            throw new Error("callback is not a function")
        }

        await this._queue()
        callback()
       
    }


    addQueue(params) {
        this.queue.push(params)
    }

    async generatePDFfromPage(params) {

        const { htmlUrl, outputPDFFolderPath, order } = params

        console.log(`Generating PDF n°${order}...`);
        const page = await this.browser.newPage();
        await page.goto(htmlUrl);
        await page.pdf({ path: join(outputPDFFolderPath, order + ".pdf"), format: 'A4' });
    }


    async mergePDFs() {

        var merger = new PDFMerger();

        if (!fs.existsSync(this.config.outputPDFFolderPath))
            fs.mkdirSync(this.config.outputPDFFolderPath, {
                recursive: true
            });


        const filenames = fs.readdirSync(resolve(this.config.outputPDFFolderPath));
        const files = []

        filenames.forEach(filename => {
            return files.push(
                new Promise(async (resolve, reject) => {

                    try {
                        await merger.add(join(this.config.outputPDFFolderPath, filename))
                        resolve()
                    } catch (err) {
                        reject()
                    }

                }))

        })

        Promise.all(files).then(async () => {

            //TODO
            await merger.setMetadata({
                producer: "pdf-merger-js based script",
                author: "John Doe",
                creator: "John Doe",
                title: "My live as John Doe"
            });

            await merger.save('merged.pdf'); //save under given name and reset the internal document

            // Export the merged PDF as a nodejs Buffer
            const mergedPdfBuffer = await merger.saveAsBuffer();
            fs.writeFileSync(join(this.config.outputGeneratedFolderPath, 'merged.pdf'), mergedPdfBuffer);
        })
    }
}