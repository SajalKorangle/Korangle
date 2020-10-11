
# This script is supposed to be run from frontend folder

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

# Running tests
protractor tests/protractor/protractor.conf.js
if [ "$?" -ne 0 ];
then
    echo 'Protractor Test failed'
    exit 1
fi

rm -rf protractorFailuresReport

# Total Run time
echo "Total Run Time: $((SECONDS - start))"
