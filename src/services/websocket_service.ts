import type {i_websocket_call_back} from "@/call_backs/i_websocket_call_back";

const connection_states = {
    CONNECTED: "CONNECTED",
    CLOSED: "CLOSED",
    ERROR: "ERROR",
    NOT_INITIALIZED: "NOT_INITIALIZED",
}

const keep_alive_interval = 20000;
function heartbeat(ws: WebSocket) {
    if (ws.readyState === 1){
        ws.send("ping");
    }
    setTimeout(heartbeat, keep_alive_interval, ws);
}

export class websocket_service {

    connection_status: string = connection_states.NOT_INITIALIZED;
    ws: WebSocket | undefined;

    constructor(private fullWerSocketUrl: string, private wsHandler: i_websocket_call_back) {
        this.connect();
        document.onvisibilitychange = () => {
            if (document.visibilityState === 'visible') {
                this.connect();
            }else if(document.visibilityState === 'hidden'){
                //this.close_connection();
            }
        };
    }
    close_connection(){
        if(this.ws === undefined) return;
        this.ws.close();
    }
    connect(){
        if(this.ws !== undefined && this.ws.readyState === 1) return;

        this.ws = new WebSocket(this.fullWerSocketUrl);
        this.ws.onopen = (event: unknown) => {
            this.connection_status = connection_states.CONNECTED;
            this.wsHandler.onopen(event);
        }
        this.ws.onerror = (event: unknown) => {
            this.connection_status = connection_states.ERROR;
            this.wsHandler.onerror(event);
        }
        this.ws.onclose = (event: unknown) => {
            this.connection_status = connection_states.CLOSED;
            this.wsHandler.onclose(event);
        }
        this.ws.onmessage = (message) => {
            this.wsHandler.onmessage(message);
        }
        heartbeat(this.ws);
    }
    send(payload: unknown) {
        if (this.connection_status !== connection_states.CONNECTED) return;
        if(this.ws === undefined) return;
        this.ws.send(JSON.stringify(payload));
    }


}