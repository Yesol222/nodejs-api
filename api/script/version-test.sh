VERSION=54be4c556e2f51fc2aa7b73290ab43582f8a1aaf
npm install "git://github.com/hyperledger/fabric-sdk-node#${VERSION}"
./script/package-postinstall.sh
npm run watch