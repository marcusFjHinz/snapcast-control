import {Stream} from "@/model/Stream";
import {Player} from "@/model/Player";

export interface i_snapcast_callback {

    on_update(streams: Array<Stream>, clients: Array<Player>): void;

}