export class Player {
    constructor(private _id: string, private _name: string,
                private _stream_id: string,private _group_id: string,
                private _volume: number, private _is_muted: boolean,
                private _is_idle: boolean, private _is_connected: boolean,
                private _last_seen: number) {}

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(new_name: string) {
        this._name = new_name;
    }

    get group_id(){
        return this._group_id;
    }

    get stream_id(){
        return this._stream_id;
    }

    get volume(){
        return this._volume;
    }

    set volume(volume: number){
        this._volume = volume;
    }

    get is_muted(){
        return this._is_muted;
    }
    get is_idle(){
        return this._is_idle;
    }
    get is_connected(){
        return this._is_connected;
    }
    get last_seen(){
        return new Date(this._last_seen * 1000)
    }
}