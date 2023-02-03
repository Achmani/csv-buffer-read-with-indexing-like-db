import * as fs from 'fs';
import { parse } from 'csv-parse';

let filepath = "./transactions.csv";
let filepathPreprocessing = "./transactions_preprocessing.csv";

const preprocessingStream = fs.createWriteStream(filepathPreprocessing, { mode: 0o600 });

function varchar(max_length: number, str: String): String {
    return str.padEnd(max_length, ' ');
}

let header = Array();
header[0] = 10;
header[1] = 10;
header[2] = 3;
header[3] = 15;

fs.createReadStream(filepath)
    .on('error', () => {
        console.log("Error");
        // handle error
    })

    .pipe(parse({fromLine: 2 }))
    .on('data', (row) => {

        for (let index = 0; index < row.length; index++) {
            row[index] = varchar(header[index], row[index]);
        }
        let buf = Buffer.from(row.toString()+"\n");
        console.log(buf.length);
        preprocessingStream.write(buf);
        // use row data
    })

    .on('end', () => {
        console.log("Preprocessing Success");
        // handle end of CSV
    })