# snapcast control 

a python, vue/quasar based stream and player centric web interface for [Snapcast](https://github.com/badaix/snapcast).

prerequisites:
* a running snapcast server
* python3 available on the system
* in order to play spotify streams: librespot available on the snapcast system

features:
* __add / remove web streams__
* __add / remove spotify streams. (requires librespot to be available on the system)__  
the streams are added and removed to / from snapcast at runtime. the snapcast configuration is not touched by the application.
* __manage players__
  - add / remove players to / from streams
  - remove players from snapcast (under development)

CAVEAT
* the server is based on the python 3 HTTPServer and employs the http protocol. do not expose the server to the internet.  
* the software is still under development. please be patient if something's missing. help is welcome though.

### Project setup
assemble the application by running
```
build.sh 
```

#### run
to start the server locally run
```
yascui.py
```
in the /build/yascui directory  
the server runs on http://localhost:1782  
to deploy changes run __build.sh__ again

### install
* copy the /build/yascui directory to the destination server
* enter the directory and run
```
sudo ./install.sh 
```

### uninstall
copy __uninstall.sh__ the destination server. run
```
sudo uninstall.sh 
```

### add / remove streams
* streams can be added / removed vai the ui
* edit the streams section in __streams.conf.json__ in the /build/yascui directory
```
    {
      "name": "BBC Radio 1",
      "url": "http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
      "stream_type": "mpv"
    },
```
will add BBC Radio 1 to with the given url to the list.  
user __"stream_type": "mpv"__ for webstreams __"stream_type": "soptify"__ when adding a soptify stream.  
### configure the server port
* edit yascui.service in the /build/yascui directory
* set the desired port as a parameter in the ExecStart- line
 ```
ExecStart=/usr/bin/python3 /usr/share/yascui/yascui.py 4711
```
will run the server on port 4711

### configure the snapcast server
#### when to configure?
if snapcast is running on the same machine and the default snapcast port (1780) is used no configuration is necessary  
in any other cases:
* edit streams.conf.json in the /build/yascui directory
* configure server address / port by adding two lines before the streams section:
```
{
  "server": "<snapcast host goes here>",
  "port": "<snapcast port goes here>",
  "streams": [
    {
```
CAVEAT:  
using the server name will work in most cases on a desktop  
mobile devices work usually only when an ip address is given  

### manage 
use systemd to manage the service:
* service start
```
    systemctl start yascui
```
* service stop
```
systemctl stop yascui
```
* service status
```
systemctl status yascui
```
* the service is configured to start at boot
* the service ist started during install
