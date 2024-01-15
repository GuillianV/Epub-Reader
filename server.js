import { EPub } from 'epub2';
import * as fs from "fs";
import { dirname , join, extname} from "path";
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = join(__dirname, "data");
const inputPath = join(__dirname, "input");
const filename = "book.epub"

const ReadEpubFile = async (filename, filepath) => {

    const fullpath = join(filepath, filename);
    if(!fs.existsSync(fullpath)) {
        console.error(chalk.red(`File not found : ${fullpath}`));
        return;
    }


    const extension = extname(filename);
    if(extension !== ".epub") {
        console.error(chalk.red(`File is not type of epub`));
        return;
    }

    const filenameWithoutExtension = filename.replace(extension, "");
    fs.mkdirSync(join(dataPath,filenameWithoutExtension,"images"), { recursive: true });
    fs.mkdirSync(join(dataPath,filenameWithoutExtension,"links"), { recursive: true });


    let epub = await EPub.createAsync(fullpath, join(dataPath,filenameWithoutExtension,"images"), join(dataPath,filenameWithoutExtension,"links"));
    console.log(epub)

}


ReadEpubFile(filename, inputPath);