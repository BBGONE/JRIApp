import * as RIAPP from "jriapp_shared";

const utils = RIAPP.Utils, _async = utils.async, CHUNK_SIZE: number = (512 * 1024);

export interface IAddHeadersArgs {
    xhr: XMLHttpRequest;
    promise: RIAPP.IPromise<any>;
}

export class Uploader extends RIAPP.BaseObject {
    private _uploadUrl: string;
    private _file: File;

    constructor(uploadUrl: string, file: File) {
        super();
        this._uploadUrl = uploadUrl;
        this._file = file;
    }
    addOnProgress(fn: (sender: Uploader, args: number) => void, nmspace?: string) {
        this.objEvents.on('progress', fn, nmspace);
    }
    addOnAddHeaders(fn: (sender: Uploader, args: IAddHeadersArgs) => void, nmspace?: string) {
        this.objEvents.on('addheaders', fn, nmspace);
    }
    uploadFile(): RIAPP.IPromise<string> {
        const self = this, chunks: Blob[] = [],
            file = this._file, FILE_SIZE: number = file.size;
        let streamPos: number = 0, endPos: number = CHUNK_SIZE;
        while (streamPos < FILE_SIZE) {
            chunks.push(file.slice(streamPos, endPos));
            streamPos = endPos; // jump by the amount read
            endPos = streamPos + CHUNK_SIZE; // set next chunk length
        }
        const len = chunks.length;
        const funcs = chunks.map((chunk, i) => () => self.uploadFileChunk(file, chunk, i + 1, len));
        const res = _async.promiseSerial(funcs).then((res) => {
            self.objEvents.raise('progress', 100);
            return file.name;
        });
        return res;
    }

    protected uploadFileChunk(file: File, chunk: Blob, part: number, total: number): RIAPP.IPromise<number> {
        const self = this, xhr = new XMLHttpRequest(), upload = xhr.upload;
        xhr.responseType = "text";
        const deffered = _async.createDeferred<number>();
        upload.onload = function (e) {
            deffered.resolve(part);
        };

        upload.onerror = function (e) {
            deffered.reject(new Error("Uploading file " + file.name + " error"));
        };
        deffered.promise().then(() => self.objEvents.raise('progress', part / total));
        xhr.open("post", self.uploadUrl, true);
        let name = encodeURIComponent(file.name);
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.setRequestHeader("X-File-Name", name);
        xhr.setRequestHeader("X-File-Size", file.size.toString());
        xhr.setRequestHeader("X-File-Type", file.type);
        xhr.setRequestHeader("X-Chunk-Num", part.toString());
        xhr.setRequestHeader("X-Chunk-Size", chunk.size.toString());
        xhr.setRequestHeader("X-Chunk-Count", total.toString());
        const args: IAddHeadersArgs = { xhr: xhr, promise: null };
        self.objEvents.raise('addheaders', args);
        const addHeadersPromise = !args.promise ? _async.resolve() : args.promise;
        return addHeadersPromise.then(() => {
            xhr.send(chunk);
            return deffered.promise();
        });
    }
    get uploadUrl() { return this._uploadUrl; }
    get fileName() { return this._file.name }
}