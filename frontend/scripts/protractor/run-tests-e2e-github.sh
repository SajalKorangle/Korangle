
mkdir -p tmp

# kill -9 `sudo lsof -t -i:4200`

# Running tests (using protractor)
npm start &
while ! echo exit | nc localhost 4200; do sleep 10; done

node ./node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update
./node_modules/.bin/protractor tests/protractor/protractor.conf.js
if [ "$?" -ne 0 ];
then
    echo 'Protractor Test failed'
    exit 1
fi
