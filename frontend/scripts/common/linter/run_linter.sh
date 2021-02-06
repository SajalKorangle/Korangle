if [ "$1" = "set" ]; then

    echo $'Updating linting error count..\nRunning tslint...\n'
    node run_linter.js "set" $(ng lint | grep -c "ERROR: /")

    # Upload to s3

elif [ "$1" = "count" ]; then

    echo $'Counting linting errors..\nRunning tslint...\n'
    node run_linter.js "count" $(ng lint | grep -c "ERROR: /")

else

    echo $'Running tslint...\n'
    ng lint

fi
