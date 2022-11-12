import {websocket_service} from "@/services/websocket_service";
import type {i_websocket_call_back} from "@/call_backs/i_websocket_call_back";
import {Stream} from "@/model/Stream";
import {Player} from "@/model/Player";
import {i_snapcast_callback} from "@/call_backs/i_snapcast_callback";
import {snapcast_templates} from "@/services/snapcast_templates";
import {ActiveStream} from "@/model/ActiveStream";
import {yascui_service} from "@/services/yascui_service";


const snapcast_ui_uuid = 'bc4bd73f-0eb3-4f9e-9c20-e71e43dc1f49';
const default_stream_name = 'default';
const default_port = 1780;

export class snapcast_repository implements i_websocket_call_back {

    wsService: websocket_service | undefined;
    configService: yascui_service | undefined;
    templates: snapcast_templates = new snapcast_templates();


    host_name = '';
    port = '';
    // eslint-disable-next-line
    stream_configurations: any[] | undefined;

    available_streams: Array<Stream> = [];
    active_streams: Array<ActiveStream> = [];
    players: Array<Player> = [];


    constructor(private call_back: i_snapcast_callback) {

        this.configService = new yascui_service(window.location.href);
        this.configService.get_config()
            .then((c) => {
                this.host_name = c.server === undefined ? window.location.hostname : c.server;
                this.port = c.server === undefined ? default_port : c.port;
                this.stream_configurations = c.streams;
                const fullUrl = "ws://" + this.host_name + ":" + this.port + "/jsonrpc";
                this.wsService = new websocket_service(fullUrl, this);
            }).catch((e) => {
            console.log(e);
        });
    }

    refresh = () => {
        this.sendToWS([]);
    }
    add_stream = (url: string, name: string): void => {
        const config = this.create_config();
        // eslint-disable-next-line
        const new_stream: any = {};
        new_stream.name = name;
        new_stream.url = url;
        new_stream.stream_type = 'mpv';

        config.streams.push(new_stream);

        this.configService?.write_config(config).then(() => this.refresh());
    }
    delete_stream = (stream: Stream): void => {
        const config = this.create_config();
        const remove = this.available_streams.filter((st) => st.id === stream.id);
        console.log(config.streams)
        remove.forEach((st) => {
            this.stop_stream(st);
            const index = config.streams.indexOf(st);
            config.streams.splice(index, 1);
        });
        console.log(config.streams)

        this.configService?.write_config(config).then(() => this.refresh());
    }


    replace_stream = (source_stream: Stream, target_stream: Stream): void => {
        const players = this.get_players_by_stream(source_stream);

        const to_be_sent = this.move_players_to_stream(target_stream, players);
        this.sendToWS(to_be_sent);
    }

    get_all_players = (): Player[] => {
        return this.players;
    }

    set_player_name = (player: Player, new_name: string): void => {
        const to_be_sent = this.templates.configure_set_player_name(player, new_name);
        this.sendToWS([to_be_sent]);
    }

    get_players_by_stream = (stream: Stream): Player[] => {
        const st = this.active_streams.find((active) => active.id === stream.id);
        if (st === undefined) {
            return new Array<Player>();
        } else {
            return st.players;
        }
    }

    stop_stream = (stream: Stream): void => {
        const to_be_sent = this.move_players_to_default(this.get_players_by_stream(stream));
        to_be_sent.push(this.templates.configure_remove_stream(stream));
        this.sendToWS(to_be_sent);
    }
    stop_player = (player: Player): void => {
        this.sendToWS(this.move_players_to_default([player]));
    }

    set_stream_for_player = (stream: Stream, player: Player): void => {
        this.sendToWS(this.move_players_to_stream(stream, [player]));
    }

    mute_player = (player: Player, mute: boolean): void => {
        const set_volume_clone = this.templates.configure_set_volume_player(player, player.volume, mute);
        this.sendToWS([set_volume_clone]);
    }

    is_muted = (stream: Stream): boolean => {
        return this.get_players_by_stream(stream)
            .map((p) => p.is_muted)
            .reduce((muted, new_val) => muted ? muted : new_val, false);
    }

    mute_stream = (stream: Stream): void => {
        const is_muted = this.is_muted(stream);
        const to_be_sent: unknown[] = [];

        this.get_players_by_stream(stream)
            .forEach((player) => to_be_sent.push(this.templates.configure_set_volume_player(player, player.volume, !is_muted)));
        this.sendToWS(to_be_sent);
    }

    update_player_volume = (client: Player): void => {
        const set_volume_clone = this.templates.configure_set_volume_player(client, client.volume, client.is_muted);
        this.sendToWS([set_volume_clone]);
    }

    //internal message handling
    onclose = (): void => {
        //under development
    }

    onerror = (event: MessageEvent): void => {
        console.log('ERROR!')
        console.log(event.data);
    }

    onopen = (): void => {
        this.refresh();
    }

    onmessage = (event: MessageEvent): void => {
        const parsed = JSON.parse(event.data);

        if (parsed.constructor.name !== "Array") return;

        const result = parsed[parsed.length - 1];
        if (result.id === snapcast_ui_uuid) {
            this.resolveActiveStreamsAndPlayers(result.result.server.groups);
            this.available_streams = this.resolveAvailableStreams();
            this.call_back.on_update(this.available_streams, this.players);
        } else {
            this.sendToWS([]);
        }
    }

    // eslint-disable-next-line
    private move_players_to_default = (players: Player[]): any[] => {
        if (players.length === 0) return [];
        const default_stream = this.active_streams.find((st) => st.id === default_stream_name);
        const source_streams = this.get_streams_by_players(players);

        // eslint-disable-next-line
        let to_be_sent: any[] = [];

        let target_group_id;
        if (default_stream !== undefined) {
            target_group_id = default_stream.groups[0];
        } else {
            target_group_id = players[0].group_id;
            to_be_sent.push(this.templates.configure_stream_of_group_by_group_id(default_stream_name, target_group_id));
        }

        to_be_sent.push(this.templates.configure_set_players_of_group(target_group_id, players));
        to_be_sent = to_be_sent.concat(this.remove_idle_streams(source_streams, players));
        return to_be_sent;
    }

    // eslint-disable-next-line
    private move_players_to_stream(target_stream: Stream, players: Player[]): any[] {
        if (players.length === 0) return [];

        //do we already have an active stream -> use its group?
        const active = this.active_streams.find((active) => active.id === target_stream.id);
        let target_group_id: string;

        //configure all needed templates
        let to_be_sent = [];

        if (active !== undefined) {
            target_group_id = active.first_group_id;
        } else {
            //use group id of first player provided / initialize the stream
            target_group_id = players[0].group_id;
            to_be_sent.push(this.templates.configure_add_stream(target_stream));
        }


        //set the new group of all clients
        to_be_sent.push(this.templates.configure_set_players_of_group(target_group_id, players));

        //set stream of group after setting the members
        if (active === undefined) {
            to_be_sent.push(this.templates.configure_stream_of_group(target_stream.id, target_group_id));
        }
        //ensure group not muted --> we ignore group properties
        to_be_sent.push(this.templates.configure_unmute_group(target_group_id));

        //remove old stream if idle
        const source_streams = this.get_streams_by_players(players);
        to_be_sent = to_be_sent.concat(this.remove_idle_streams(source_streams, players));
        return to_be_sent;
    }

    private is_stream_busy = (stream: Stream, players_to_ignore: Player[]): boolean => {
        if (stream.id === default_stream_name) return true;

        const active_stream = this.active_streams.find((active) => active.id === stream.id);
        if (active_stream === undefined) return false;
        let is_busy = false;
        active_stream.players.forEach((active_player) => {
            const found = players_to_ignore.filter((player_to_ignore) => player_to_ignore.id === active_player.id);
            if (found.length === 0) is_busy = true;
        });
        return is_busy;
    }

    // eslint-disable-next-line
    private remove_idle_streams = (streams: Stream[], players: Player[]): any[] => {
        // eslint-disable-next-line
        const ret: any[] = [];
        streams.filter((st) => !this.is_stream_busy(st, players))
            .forEach((st) => ret.push(this.templates.configure_remove_stream(st)));
        return ret;
    }

    private get_streams_by_players = (players: Player[]): Stream[] => {
        const ret: Stream[] = [];
        players.forEach((p) => {
            const st = this.get_stream_by_player(p);
            if (st !== undefined && !ret.includes(st)) {
                ret.push(st);
            }
        });
        return ret;
    }

    private get_stream_by_player = (player: Player): Stream | undefined => {
        return this.available_streams.find((stream) => stream.id === player.stream_id);
    }

    // eslint-disable-next-line
    private create_config = (): any => {
        // eslint-disable-next-line
        const config: any = {};
        config.server = this.host_name;
        config.port = this.port;
        config.streams = this.stream_configurations;
        return config;

    }

    private resolveActiveStreamsAndPlayers = (read: []): void => {
        this.players.splice(0);
        this.active_streams.splice(0);

        // eslint-disable-next-line
        read.forEach((group: any) => {
            const st = this.active_streams.find((stream) => stream.id === group.stream_id) || new ActiveStream(group.stream_id);
            if (!this.active_streams.includes(st)) this.active_streams.push(st);
            st.add_group(group.id);
            // eslint-disable-next-line
            group.clients.forEach((p: any) => {
                const player = new Player(p.id, p.config.name, group.stream_id,
                    group.id, p.config.volume.percent, p.config.volume.muted, group.stream_id === default_stream_name,
                    p.connected, p.lastSeen.sec);
                console.log(p)
                console.log(player.last_seen)
                this.players.push(player);
                st.add_player(player);
            })
        });
    }

    private resolveAvailableStreams = (): Stream[] => {
        const ret: Array<Stream> = [];
        this.stream_configurations?.forEach((config) => {
            const st = new Stream(config.name, config.stream_type, config.url);
            ret.push(st);
        });
        return ret;
    }

    // eslint-disable-next-line
    private sendToWS = (to_be_sent: any[]): void => {
        to_be_sent.push(this.templates.configure_server_status(snapcast_ui_uuid));
        this.wsService?.send(to_be_sent);
    }

}