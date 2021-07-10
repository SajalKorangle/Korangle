
mkdir -p tmp

# kill -9 `sudo lsof -t -i:4200`

# Running tests (using protractor)
npm start &
while ! echo exit | nc localhost 4200; do sleep 10; done

# updating chromedriver version
./node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update --versions.chrome 88.0.4324.96

./node_modules/.bin/protractor tests/protractor/protractor.conf.js
if [ "$?" -ne 0 ];
then
    echo "Protractor Test failed"
    exit 1
else
    echo "Protractor Test passed"
fi
