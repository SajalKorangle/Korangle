# for CI platform only


if [[ ! -f benchmark-linting-error-count.json ]]; then

    echo $'{\n\t\"tslint-errors\": 0\n}' > benchmark-linting-error-count.json

fi

echo $'CI: Testing linting error count...\n'
node run_linter.js "ci" $(ng lint | grep -c "ERROR: /") || exit

# upload to aws
# aws cp
echo $'\nLinter benchmark updated.\n'
