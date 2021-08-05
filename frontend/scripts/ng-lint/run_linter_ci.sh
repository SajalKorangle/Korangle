./node_modules/@angular/cli/bin/ng lint
ERROR_COUNT=$(./node_modules/@angular/cli/bin/ng lint | grep -c "ERROR: ")

if [[ $ERROR_COUNT -gt 0 ]]
then
    echo "ERROR: Linter found $ERROR_COUNT errors"
    exit 1
fi