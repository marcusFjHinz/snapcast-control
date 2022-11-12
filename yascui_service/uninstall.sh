#!/bin/bash

echo yascui: START uninstall
echo yascui: stopimg service
systemctl stop yascui
echo yascui: reload services
systemctl daemon-reload

echo yascui: romoving files/directories
rm -rf /usr/share/yascui
rm  /lib/systemd/system/yascui.service
echo yascui: uninstall DONE!


