import {Stream} from "@/model/Stream";
import {Player} from "@/model/Player";

const stream_types = {
    'mpv': 'mpv',
    'spotify': 'spotify'
}

const server_status_template = {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "Server.GetStatus"
}
const set_stream_template_of_group = {
    "id": 4,
    "jsonrpc": "2.0",
    "method": "Group.SetStream",
    "params": {
        "id": "<group-id>",
        "stream_id": "<stream-id>"
    }
}
const mute_group_template = {
    "id": 5,
    "jsonrpc": "2.0",
    "method": "Group.SetMute",
    "params": {
        "id": "<group-id>",
        "mute": true,
    }
}
const set_volume_client_template = {
    "id":"8",
    "jsonrpc":"2.0",
    "method":"Client.SetVolume",
    "params":{
        "id":"<client-id>",
        "volume":
            {
                "muted":false,
                "percent":74
            }
    }
}
const set_clients_of_group_template = {
    "id":3,
    "jsonrpc":"2.0",
    "method":"Group.SetClients",
    "params":{
        "clients":[
        ],
        "id":"<group-id>"
    }
}
const add_stream_template = {
    "id":8,
    "jsonrpc":"2.0",
    "method":"Stream.AddStream",
    "params":{
        "streamUri":"<stream-uri>"
    }
}
const remove_stream_template = {
    "id":8,
    "jsonrpc":"2.0",
    "method":"Stream.RemoveStream",
    "params":{
        "id":"<stream_id>"
    }
}

const set_player_name_template = {
    "id":7,
    "jsonrpc":"2.0",
    "method":"Client.SetName",
    "params": {
        "id":"<player_id>",
        "name":"<name>"
    }
}

const stream_templates = {
    'mpv': 'process:///usr/bin/mpv?name=<name>&sampleformat=48000:16:2&params=<uri>' +
        ' --no-terminal --audio-display=no --audio-channels=stereo --audio-samplerate=48000' +
        ' --audio-format=s16 --ao=pcm --ao-pcm-file=/dev/stdout',
    'spotify': 'librespot:///librespot?name=<name>&dryout_ms=2000' +
        '&devicename=<name>&bitrate=320&wd_timeout=7800'
}

export class snapcast_templates{

    // eslint-disable-next-line
    configure_set_player_name = (player: Player, new_name: String): any =>{
        const cloned = this.cloneJson(set_player_name_template);
        cloned.params.id = player.id;
        cloned.params.name = new_name;
        return this.cloneJson(cloned);
    }

    // eslint-disable-next-line
    configure_server_status = (id: string): any =>{
        const cloned = this.cloneJson(server_status_template);
        cloned.id = id;
        return this.cloneJson(cloned);
    }

    // eslint-disable-next-line
    configure_add_stream = (stream: Stream): any =>{
        const add_stream_clone = this.cloneJson(add_stream_template);
        let uri = '';
        if(stream.stream_type === stream_types.mpv){
            uri = (' ' + stream_templates.mpv).slice(1);
            uri = uri.replace('<name>', stream.name);
            uri = uri.replace('<uri>', stream.uri);
        }else if(stream.stream_type === stream_types.spotify){
            uri = (' ' + stream_templates.spotify).slice(1);
            uri = uri.replaceAll('<name>', stream.name);
        }
        add_stream_clone.params.streamUri = uri;
        return add_stream_clone;
    }

    // eslint-disable-next-line
    configure_remove_stream = (stream: Stream): any =>{
        return this.configure_remove_stream_by_stream_id(stream.id);
    }

    // eslint-disable-next-line
    configure_remove_stream_by_stream_id = (stream_id: string): any =>{
        const remove_stream_clone = this.cloneJson(remove_stream_template);
        remove_stream_clone.params.id = stream_id;
        return remove_stream_clone;
    }

    // eslint-disable-next-line
    configure_set_players_of_group = (group_id: string, players: Player[]): any =>{
        return this.configure_set_player_of_group_by_group_id(group_id, players);
    }

    // eslint-disable-next-line
    configure_set_player_of_group_by_group_id = (group_id: string, player: Player[]): any =>{
        const clone = this.cloneJson(set_clients_of_group_template);
        clone.params.id = group_id;
        player.forEach((cl) => clone.params.clients.push(cl.id));
        return clone;
    }

    // eslint-disable-next-line
    configure_unmute_group = (group_id: string): any =>{
        const mute_group_clone = this.cloneJson(mute_group_template);
        mute_group_clone.params.id = group_id;
        mute_group_clone.params.mute = false;
        return mute_group_clone;

    }

    // eslint-disable-next-line
    configure_set_volume_player = (player: Player, volume: number, mute: boolean): any =>{
        const set_volume_clone = this.cloneJson(set_volume_client_template);
        set_volume_clone.params.id = player.id;
        set_volume_clone.params.volume.muted = mute;
        set_volume_clone.params.volume.percent = volume;
        return set_volume_clone;
    }

    // eslint-disable-next-line
    configure_stream_of_group = (stream_id: string, group_id: string): any =>{
        return this.configure_stream_of_group_by_group_id(stream_id, group_id);
    }

    // eslint-disable-next-line
    configure_stream_of_group_by_group_id = (stream_id: string, group_id: string): any =>{
        const set_stream_clone = this.cloneJson(set_stream_template_of_group);
        set_stream_clone.params.stream_id = stream_id;
        set_stream_clone.params.id = group_id;
        return set_stream_clone;
    }

    // eslint-disable-next-line
    private cloneJson = (jsonIn: any) : any =>{
        return  JSON.parse(JSON.stringify(jsonIn));
    }

}

