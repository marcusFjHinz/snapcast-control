rm -rf ./build
mkdir -p ./build/yascui/snappy

npm install
npm run build

cp -r ./dist/* ./build/yascui/snappy
cp -r ./yascui_service/* ./build/yascui

