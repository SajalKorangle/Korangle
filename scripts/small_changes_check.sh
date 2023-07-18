FRONTEND_LINE_CHANGE_COUNT=$(git diff -w --shortstat origin/master frontend | awk '{print $4 + $6}')
BACKEND_LINE_CHANGE_COUNT=$(git diff -w --shortstat origin/master backend | awk '{print $4 + $6}')
FRONTEND_FILE_CHANGE_COUNT=$(git diff -w --shortstat origin/master frontend | awk '{print $1}')
BACKEND_FILE_CHANGE_COUNT=$(git diff -w --shortstat origin/master backend | awk '{print $1}')
OVERALL_LINE_CHANGE_COUNT=$(git diff -w --shortstat origin/master | awk '{print $4 + $6}')
OVERALL_FILE_CHANGE_COUNT=$(git diff -w --shortstat origin/master | awk '{print $1}')

FRONTEND_LINE_CHANGE_COUNT_LIMIT=500
BACKEND_LINE_CHANGE_COUNT_LIMIT=500
FRONTEND_FILE_CHANGE_COUNT_LIMIT=10
BACKEND_FILE_CHANGE_COUNT_LIMIT=10
OVERALL_LINE_CHANGE_COUNT_LIMIT=750
OVERALL_FILE_CHANGE_COUNT_LIMIT=15


## Frontend Check Starts
if [[ $FRONTEND_LINE_CHANGE_COUNT -gt $FRONTEND_LINE_CHANGE_COUNT_LIMIT ]]
then
    echo "ERROR: Number of changed lines in frontend ($FRONTEND_LINE_CHANGE_COUNT) should be less than ($FRONTEND_LINE_CHANGE_COUNT_LIMIT)"
    exit 1
fi

if [[ $FRONTEND_FILE_CHANGE_COUNT -gt $FRONTEND_FILE_CHANGE_COUNT_LIMIT ]]
then
    echo "ERROR: Number of changed files in frontend ($FRONTEND_FILE_CHANGE_COUNT) should be less than ($FRONTEND_FILE_CHANGE_COUNT_LIMIT)"
    exit 1
fi
## Frontend Check Ends

## Backend Check Starts
if [[ $BACKEND_LINE_CHANGE_COUNT -gt $BACKEND_LINE_CHANGE_COUNT_LIMIT ]]
then
    echo "ERROR: Number of changed lines in backend ($BACKEND_LINE_CHANGE_COUNT) should be less than ($BACKEND_LINE_CHANGE_COUNT_LIMIT)"
    exit 1
fi

if [[ $BACKEND_FILE_CHANGE_COUNT -gt $BACKEND_FILE_CHANGE_COUNT_LIMIT ]]
then
    echo "ERROR: Number of changed files in backend ($BACKEND_FILE_CHANGE_COUNT) should be less than ($BACKEND_FILE_CHANGE_COUNT_LIMIT)"
    exit 1
fi
## Backend Check Ends

## Overall Check Starts
if [[ $OVERALL_LINE_CHANGE_COUNT -gt $OVERALL_LINE_CHANGE_COUNT_LIMIT ]]
then
    echo "ERROR: Number of changed lines overall ($OVERALL_LINE_CHANGE_COUNT) should be less than ($OVERALL_LINE_CHANGE_COUNT_LIMIT)"
    exit 1
fi

if [[ $OVERALL_FILE_CHANGE_COUNT -gt $OVERALL_FILE_CHANGE_COUNT_LIMIT ]]
then
    echo "ERROR: Number of changed files overall ($OVERALL_FILE_CHANGE_COUNT) should be less than ($OVERALL_FILE_CHANGE_COUNT_LIMIT)"
    exit 1
fi
## Overall Check Ends

echo "PR Change Success"
echo "Number of changed lines in frontend ($FRONTEND_LINE_CHANGE_COUNT)"
echo "Number of changed files in frontend ($FRONTEND_FILE_CHANGE_COUNT)"
echo "Number of changed lines in backend ($BACKEND_LINE_CHANGE_COUNT)"
echo "Number of changed files in backend ($BACKEND_FILE_CHANGE_COUNT)"
echo "Number of changed lines overall ($OVERALL_LINE_CHANGE_COUNT)"
echo "Number of changed files overall ($OVERALL_FILE_CHANGE_COUNT)"
