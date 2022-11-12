import {Ref, ref, UnwrapRef} from "vue";

import {i_snapcast_callback} from "@/call_backs/i_snapcast_callback";
import {snapcast_repository} from "@/services/snapcast_repository";
import {Stream} from "@/model/Stream";
import {Player} from "@/model/Player";

export class snapcast_service implements i_snapcast_callback {

    private snapCastRepository;

    private _streams = ref(Array<Stream>());
    private _players = ref(Array<Player>());

    constructor() {

        this.snapCastRepository = new snapcast_repository(this);

    }
    refresh = () => {
        this.snapCastRepository.refresh();
    }

    replace_stream = (sourceStream: Stream, targetStream: Stream): void => {
        this.snapCastRepository.replace_stream(sourceStream, targetStream);
    }

    persist_player_name = (player: Player, new_name: string): void => {
        this.snapCastRepository.set_player_name(player, new_name);
    }
    set_stream_for_player = (stream: Stream, player: Player): void => {
        this.snapCastRepository.set_stream_for_player(stream, player);
    }


    toggle_mute_stream = (stream: Stream): void => {
        this.snapCastRepository.mute_stream(stream);
    }

    get_stream_volume = (stream: Stream): number => {
        const players = this.snapCastRepository.get_players_by_stream(stream);
        return Math.ceil(
            players
                .map((p) => p.volume)
                .reduce((sum, add) => sum + add, 0) / players.length);

    }
    change_stream_volume = (stream: Stream, diff: number): number => {
        const players = this.snapCastRepository.get_players_by_stream(stream);
        return Math.ceil(
        players.map((p) => {
            this.update_player_volume(p, diff);
            return p.volume;
        }).reduce((sum, add) => sum + add) / players.length);
    }

    is_muted_stream = (stream: Stream): boolean => {
        return this.snapCastRepository.is_muted(stream);
    }

    stop_stream = (stream: Stream): void => {
        this.snapCastRepository.stop_stream(stream);
    }

    toggle_mute_player = (player: Player): void => {
        this.snapCastRepository.mute_player(player, !player.is_muted);
    }

    update_player_volume = (player: Player, diff: number): void => {

        let computed = player.volume + diff;
        if(computed > 100){
            computed = 100;
        }else if(computed < 0 ){
            computed = 0;
        }
        player.volume = computed;
        this.snapCastRepository.update_player_volume(player)
    }


    stop_player = (player: Player): void => {
        this.snapCastRepository.stop_player(player);
    }

    add_stream = (url: string, name: string): void => {
        this.snapCastRepository.add_stream(url, name);
    }
    delete_stream = (stream: Stream): void => {
        this.snapCastRepository.delete_stream(stream);
    }


    get streams(): Ref<UnwrapRef<Stream[]>> {
        return this._streams;
    }

    get players(): Ref<UnwrapRef<Player[]>> {
        return this._players;
    }

    on_update(streamsIn: Stream[], playersIn: Player[]): void {
        this._streams.value.splice(0);
        this._players.value.splice(0);
        streamsIn.forEach((stream) => this._streams.value.push(stream));
        playersIn.forEach((player) => this._players.value.push(player));
    }

}
