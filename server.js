import { EPub } from 'epub2';
import * as fs from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import util from 'util'
import express from "express";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, "data");
const inputPath = join(__dirname, "input");
const filename = "japon.epub"

const ReadEpubFile = async (filename, filepath) => {

    const fullpath = join(filepath, filename);
    if (!fs.existsSync(fullpath)) {
        console.error(chalk.red(`File not found : ${fullpath}`));
        return;
    }


    const extension = extname(filename);
    if (extension !== ".epub") {
        console.error(chalk.red(`File is not type of epub`));
        return;
    }

    const filenameWithoutExtension = filename.replace(extension, "");
    fs.mkdirSync(join(dataPath, filenameWithoutExtension, "images"), { recursive: true });
    fs.mkdirSync(join(dataPath, filenameWithoutExtension, "links"), { recursive: true });


    let epub = await EPub.createAsync(fullpath, join(dataPath, filenameWithoutExtension, "images"), join(dataPath, filenameWithoutExtension, "links"));

    // epub.getFile("ebook_agoradventure_172x245mm_-_v22-1", (err,data)=>{
    //     console.log(data)
    //     fs.writeFileSync(join(dataPath,filenameWithoutExtension,"ebook_agoradventure_172x245mm_-_v22-1.xhtml"), data)
    // })

console.log(util.inspect(epub.manifest, false, 0, true /* enable colors */))

    Object.values(epub.manifest).forEach((item) => {

        const path = join(dataPath, filenameWithoutExtension, "images", item.id)
        if (!fs.existsSync(path)) {

            epub.getImage(item.id, (error, data, mimeType) => {
                if (data)
                    fs.writeFile(join(dataPath, filenameWithoutExtension, "images", item.id), data, (err) => {
                        if (err) {
                            console.error(chalk.red(`Error while writing file ${item.id}`));
                            return;
                        }
                        console.log(chalk.green(`File ${item.id} has been saved!`));
                    });
            })

           
        }
        
    })


  
    app.get("/:chapter", (req, res) => {

     
        epub.getChapterRaw(epub.flow[req.params.chapter ?? 0].id, (error, text) => {


            res.send(text);
          

        })

    });
}


ReadEpubFile(filename, inputPath);


app.use('image/:asset', (req, res, next) => {
  express.static(__dirname + '/data/japon/images/'+ req.params.asset)(req, res, next);
});         



// PORT
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});