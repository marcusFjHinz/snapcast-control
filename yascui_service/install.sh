#!/bin/bash

echo yascui: START install
echo yascui: reset / create directory
rm -rf /usr/share/yascui
mkdir /usr/share/yascui
mkdir /usr/share/yascui/snappy

echo yascui: copy ressources
cp ./yascui.py /usr/share/yascui
cp ./streams.conf.json /usr/share/yascui
cp -r ./snappy/* /usr/share/yascui/snappy

echo yascui: install service
cp ./yascui.service /lib/systemd/system

echo yascui: start service
systemctl daemon-reload
systemctl restart yascui
echo yascui: DONE install
