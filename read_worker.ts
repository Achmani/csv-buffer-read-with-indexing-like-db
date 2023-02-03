import * as fs from 'graceful-fs';
import { parentPort, workerData } from 'worker_threads';

interface tokenIndexing {
    [key: string]: Array<number>;
}

function accessData(indexes: Array<number>) {
    let data = Array();
    console.log("Accessing Data ");
    indexes.forEach(index => {

        const lengthData = 42;

        const stream = fs.createReadStream(
            './transactions_preprocessing.csv',
            {
                start: (index - 1) * 42,
                end: index * 42,
            }
        );

        stream.on('data', (chunk) => {
            data.push(chunk.toString('utf8'));
        });

    });
}

parentPort?.postMessage(
    accessData(workerData.value)
);