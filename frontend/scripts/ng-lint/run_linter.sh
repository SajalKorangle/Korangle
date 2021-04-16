if [ "$1" == "-show" ]; then

    if [ -z "$2" ]; then

        echo $'Showing all linting errors...\n'

        ng lint

    elif [ -z "$3" ]; then

        echo $"Showing \"$2\" linting errors "

        ng lint | grep -m$2 "ERROR: /"
    
    else

        echo $"Searching \"$2\" linting errors for \"$3\""

        ng lint | grep -m$2 $3

    fi

elif [ "$1" == "-count" ]; then

    if [ -z "$2" ]; then

        echo $'Counting all linting errors...\n'

        node ./scripts/ng-lint/run_linter.js "dev" $(ng lint | grep -c "ERROR: /")

    else

        echo $"Counting linting errors for \"$2\""

        ng lint | grep -c $2

    fi

else

    echo $"run_linter.sh -count:               Count the total number of linting errors."
    echo $"run_linter.sh -count [pattern]:     Count number of linting errors matching with [pattern]."
    echo $"run_linter.sh -show:                Show all linting errors"
    echo $"run_linter.sh -show [n]:            Show n number of linting errors"
    echo $"run_linter.sh -show [n] [pattern]:  Show n number of linting errors  with [pattern]"

fi
