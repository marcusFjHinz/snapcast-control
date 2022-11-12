#!/usr/bin/python3
import json
import logging
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from systemd.journal import JournalHandler


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        snappy_dir = os.path.join(os.path.dirname(__file__), 'snappy')
        super().__init__(*args, directory=snappy_dir, **kwargs)

    def do_GET(self):
        if self.path.endswith('/get_config'):
            self.get_config()
        else:
            super().do_GET()

    def do_POST(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        log = logging.getLogger('snapcast_config_server')
        log.addHandler(JournalHandler())
        log.info('reading new config')
        content_len = int(self.headers.get('Content-Length'))
        path = os.path.join(os.path.dirname(__file__), 'streams.conf.json')
        post_body = self.rfile.read(content_len)
        with open(path, 'w') as f:
            f.write(post_body.decode("utf-8"))
            f.close()
        log.setLevel(logging.INFO)
        log.info(post_body.decode("utf-8"))
        log.info('written to streams.conf.json')
        self.wfile.write(bytes('ok', encoding='utf8'))

    def get_config(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        path = os.path.join(os.path.dirname(__file__), 'streams.conf.json')
        with open(path, 'rb') as f:
            data = json.load(f)
            self.wfile.write(bytes(json.dumps(data), encoding='utf8'))
            f.close()


port = 1782 if len(sys.argv) == 1 else int(sys.argv[1])
httpd = HTTPServer(('0.0.0.0', port), Handler)

httpd.serve_forever()
