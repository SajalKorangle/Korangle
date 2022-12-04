LINE_CHANGE_COUNT=$(git diff -w --shortstat origin/master | awk '{print $4 + $6}')
FILE_CHANGE_COUNT=$(git diff -w --shortstat origin/master | awk '{print $1}')

if [[ $LINE_CHANGE_COUNT -gt 500 ]]
then
    echo "ERROR: Number of changed lines ($LINE_CHANGE_COUNT) should be less than 500"
    exit 1
fi

if [[ $FILE_CHANGE_COUNT -gt 10 ]]
then
    echo "ERROR: Number of changed files $FILE_CHANGE_COUNT should be less than 10"
    exit 1
fi

echo "PR Change Success\nNumber of changed lines: $LINE_CHANGE_COUNT\nNumber of changed files: $FILE_CHANGE_COUNT"
