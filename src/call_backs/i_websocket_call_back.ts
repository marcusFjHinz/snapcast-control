export interface i_websocket_call_back {
    onmessage(event: unknown): void;

    onerror(event: unknown): void;

    onopen(event: unknown): void;

    onclose(event: unknown): void;
}