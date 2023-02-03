import * as fs from 'graceful-fs';
import { indexesSummary } from './headers/transactions_summary_header';

export interface errorCallback {
    (err: NodeJS.ErrnoException): void;
}

export interface successCallback {
    (): void;
}

export interface processRow {
    (row: any): void;
}


export function move(oldPath: string, newPath: string, errorCallback: errorCallback, successCallback: successCallback) {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                errorCallback(err);
            }
            return;
        }
        successCallback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', errorCallback);
        writeStream.on('error', errorCallback);

        readStream.on('close', function () {
            fs.unlink(oldPath, successCallback);
        });

        readStream.pipe(writeStream);
    }
}


export function getStreamData(filepath: string, row: number, dataLength: number): Promise<string | Buffer> {
    return new Promise<string | Buffer>(resolve => {
        const stream = fs.createReadStream(filepath, { start: (row - 1) * dataLength, end: row * dataLength });

        stream.on('error', () => {
            throw new Error("Data not found");
        });

        stream.on('data', (chunk) => {
            resolve(chunk);
        });
    });
}


export function errorCallback(err: NodeJS.ErrnoException) {
    if (err) {
        throw new Error(err.message);
    }
}

export function getIndexing(filepathIndexingDatasources: string): indexesSummary {
    try {
        return JSON.parse(fs.readFileSync(filepathIndexingDatasources).toString('utf-8'));
    } catch (err: any) {
        return { "maxLength": 0 };
    }
}

export function successCallback() {
}