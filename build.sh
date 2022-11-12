echo START build DONE
echo cleaning up ...
rm -rf ./build
mkdir -p ./build/yascui/snappy

echo running npm install
npm install
echo running npm build
npm run build

echo copy files
cp -r ./dist/* ./build/yascui/snappy
cp -r ./yascui_service/* ./build/yascui
echo build DONE!
