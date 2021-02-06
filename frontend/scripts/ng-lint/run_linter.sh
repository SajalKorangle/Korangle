if [ "$1" == "-show" ]; then

    if [ -z "$2" ]; then

        echo $'Showing all linting errors...\n'

        ng lint

    else

        echo $"Searching linting errors for \"$2\""

        ng lint | grep $2

    fi

elif [ "$1" == "-count" ]; then

    if [ -z "$2" ]; then

        echo $'Counting all linting errors...\n'

        node run_linter.js "dev" $(ng lint | grep -c "ERROR: /")

    else

        echo $"Counting linting errors for \"$2\""

        ng lint | grep -c $2

    fi

else

    echo $"run_linter.sh -count:           Count the total number of linting errors."
    echo $"run_linter.sh -count [pattern]: Count number of linting errors matching with [pattern]."
    echo $"run_linter.sh -show:            Show all linting errors."
    echo $"run_linter.sh -show [pattern]:  Show linting errors matching with [pattern]."

fi
