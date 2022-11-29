CHANGE_COUNT=$(git diff -w --shortstat origin/master | awk '{print $4 + $6}')

if [[ $CHANGE_COUNT -gt 500 ]]
then
    echo "ERROR: Number of changed lines ($CHANGE_COUNT) should be less than 600"
    exit 1
fi

if [[ $CHANGE_COUNT -lt 500 ]]
then
    echo "Success: Number of changed lines ($CHANGE_COUNT) is less than 500"
    exit 1
fi
