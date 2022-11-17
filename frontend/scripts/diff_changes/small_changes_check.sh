CHANGE_COUNT=$(git diff -w --shortstat origin/master | awk '{print $4 + $6}')

if [[ $CHANGE_COUNT -gt 600 ]]
then
    echo "ERROR: Number of changed lines ($CHANGE_COUNT) should be less than 600"
    exit 1
fi
