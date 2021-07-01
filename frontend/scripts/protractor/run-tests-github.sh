
mkdir -p tmp

# kill -9 `sudo lsof -t -i:4200`

# Running tests (using protractor)
npm start &
while ! echo exit | nc localhost 4200; do sleep 10; done


./node_modules/.bin/protractor tests/protractor/protractor.conf.js

if [ "$?" -ne 0 ];
then
    echo "Protractor Test failed"
    exit 1
else
    echo "Protractor Test passed"
fi
