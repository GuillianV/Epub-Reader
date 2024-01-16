import puppeteer from 'puppeteer';
import PDFMerger from 'pdf-merger-js';
import fs from 'fs';
import { join, resolve } from 'path';
let instance = null


export default class EPdfInstance {

    constructor() {
        if (instance !== null) {
            return instance
        }
        instance = this

    }

    async init() {
        if (this.browser == null)
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


    async generatePDFfromPage(url, outputPath) {
        const page = await this.browser.newPage();
        await page.goto(url);
        await page.pdf({ path: outputPath, format: 'A4' });
    }

    async generatePDFfromHTML(htmlContent, outputPath) {
        const page = await this.browser.newPage();
        await page.setContent(htmlContent);
        await page.pdf({ path: outputPath, format: 'A4' });
    }


    async mergePDFs(path) {

        var merger = new PDFMerger();

        if(!fs.existsSync(path))
            fs.mkdirSync(path, {
                recursive: true
            });
        const files = fs.readdirSync(resolve(path));
        const pdfs = []
        files.forEach(file => {
            return pdfs.push(
                new Promise(async (resolve, reject) => {

                    try {
                        await merger.add(join(path, file))
                        resolve()
                    } catch (err) {
                        reject()
                    }

                }))

        })

        Promise.all(pdfs).then(async () => {

            // Set metadata
            await merger.setMetadata({
                producer: "pdf-merger-js based script",
                author: "John Doe",
                creator: "John Doe",
                title: "My live as John Doe"
            });

            await merger.save('merged.pdf'); //save under given name and reset the internal document

            // Export the merged PDF as a nodejs Buffer
            const mergedPdfBuffer = await merger.saveAsBuffer();
            fs.writeFileSync(join(path, 'merged.pdf'), mergedPdfBuffer);
        })
    }
}