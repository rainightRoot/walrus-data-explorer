npm run build
zip -r dist.zip ./dist/*
scp -r ./dist.zip root@149.102.141.31:/www/wwwroot/walrus-explorer.equinoxdao.xyz
ssh root@149.102.141.31 "cd /www/wwwroot/walrus-explorer.equinoxdao.xyz; unzip -o dist.zip;cp -r ./dist/* ./"