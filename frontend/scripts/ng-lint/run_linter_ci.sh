# for CI platform only


if [[ ! -f benchmark-linting-error-count.json ]]; then

    echo $'{\n\t\"tslint-errors\": 0\n}' > ./scripts/ng-lint/benchmark-linting-error-count.json

fi

echo $'CI: Testing linting error count...\n'
node ./scripts/ng-lint/run_linter.js "ci" $(./node_modules/@angular/cli/bin/ng lint | grep -c "ERROR: /") || exit

# upload to aws
aws s3 cp ./scripts/ng-lint/benchmark-linting-error-count.json s3://korangleplus/benchmark-linting-error-count.json
echo $'\nLinter benchmark updated.\n'
