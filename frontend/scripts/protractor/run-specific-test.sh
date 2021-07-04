
# This script is supposed to be run from frontend folder

if [ "$#" -ne 1 ]; then
    echo "You must give exactly 1 protractor test file as argument"
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "$1 file doesn't exist"
    exit 1
fi

mkdir -p tmp

rm -rf protractorFailuresReport

kill -9 `ps aux | grep testserver | awk '{ print $2 }'`
sleep 5
result=`netstat -an | grep '127.0.0.1.8000' | grep -c 'LISTEN'`
if [[ "$result" == 1 ]];
then
    echo 'A server is already running at port 8000. Please stop it first'
    exit 1
fi

result=`netstat -an | grep '127.0.0.1.4200' | grep -c 'LISTEN'`
if [[ "$result" == 0 ]];
then
    echo 'Frontend server should be running at port 4200. Please check if it is running'
    exit 1
fi

start=$SECONDS

# Initiate virtual environment for backend server
source $KORANGLE_VIRTUAL_ENVIRONMENT_PATH

# updating chromedriver version
./node_modules/protractor/node_modules/webdriver-manager/bin/webdriver-manager update --versions.chrome 88.0.4324.96

# Running tests
protractor tests/protractor/protractor.conf.js --specs=$1
if [ "$?" -ne 0 ];
then
    echo 'Protractor Test failed'
    exit 1
fi

rm -rf protractorFailuresReport

# Total Run time
echo "Total Run Time: $((SECONDS - start))"
