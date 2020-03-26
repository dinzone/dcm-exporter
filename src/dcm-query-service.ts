const lastResultFile = './dcmLastResult.txt';
import fse from 'fs-extra';
import { default as moment, Moment } from 'moment';

interface ResultFileObject {
    lastRequestTime: Moment,
    result: PortBitrate[]
}

export interface PortBitrate {
    port: number;
    input: number;
    output: number;
}


export interface DcmQueryOptions {
    dcmUrl?: string,
    intervalRequestInSeconds?: number
}

export class DcmQuery {
    private _results: PortBitrate[];
    private _lastRequest: Moment
    private _intervalRequest: number
    private _dcmUrl: string;
    constructor({
        intervalRequestInSeconds = 15,
        dcmUrl = 'http://localhost:9846/bitrate'
    }: DcmQueryOptions) {
        let lastResult: ResultFileObject = {
            lastRequestTime: moment(),
            result: []
        };
        this._intervalRequest = intervalRequestInSeconds;
        this._dcmUrl = dcmUrl;
        try {
            // try read from backup file
            let fileResult = fse.readJSONSync(lastResultFile);
            lastResult = {
                lastRequestTime: moment(fileResult.lastRequestTime),
                result: fileResult.result
            };
        } catch (err) {
            console.log(`could not read from file, ignore: ${err}`);
        }
        finally {
            this._lastRequest = lastResult.lastRequestTime;
            this._results = lastResult.result;
        }
    }
    async getBitrate(force: boolean = false): Promise<PortBitrate[]> {
        // in case not force and the data is still relevant
        if (!force && moment(moment()).diff(this._lastRequest, 's') < this._intervalRequest) {
            return this._results;
        }
        try {
            // query dcm
            this._results = await this._queryDCM();
            this._lastRequest = moment();
            // try to save the result to file
            try {
                let resultToFile: ResultFileObject = {
                    lastRequestTime: this._lastRequest,
                    result: this._results
                }
                await fse.ensureFile(lastResultFile);
                await fse.writeJSON(lastResultFile, resultToFile);
                // in case we failed to save to file, ignore and continue
            } catch (err) {
                console.log(`could not save the last result, ignore it: ${err}`);
            }
        } catch (err) {
            console.log(`some error eccured while try query dcm, return the last results: ${err}`);
        }
        finally {
            // anyway return the last result
            return this._results;
        }
    }
    // TODO: implement real query to dcm
    private async _queryDCM(): Promise<PortBitrate[]> {
        let result: PortBitrate[] = [];
        for (let i = 1; i < 2000; i++) {
            result.push({
                port: i,
                input: Math.random() * 3,
                output: Math.random() * 3
            });
        }
        return result;
    }
};