export class Stream {
    constructor(private _id: string, private _stream_type: string, private _uri: string) {
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._id;
    }

    get stream_type() {
        return this._stream_type;
    }

    get uri() {
        return this._uri;
    }

}