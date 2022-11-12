rm -rf ./yascui
mkdir ./yascui
mkdir ./yascui/snappy

npm run build

cp -r ./dist/* ./yascui/snappy
cp -r ./yascui_service/* ./yascui

