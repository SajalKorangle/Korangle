
mkdir -p tmp

# kill -9 `sudo lsof -t -i:4200`

# Running tests (using protractor)
npm start &
while ! echo exit | nc localhost 4200; do sleep 10; done

chrome_version=`./node_modules/puppeteer/.local-chromium/linux-818858/chrome-linux/chrome --version`
string_array=($chrome_version)
echo ${string_array[1]}
node ./node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update --versions.chrome=${string_array[1]}
./node_modules/.bin/protractor tests/protractor/protractor.conf.js

if [ "$?" -ne 0 ];
then
    echo "Protractor Test failed"
    exit 1
else
    echo "Protractor Test passed"
fi
