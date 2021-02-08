# for CI platform only

echo "{
 \"numberOfSemiColonInTests\": 1
}" > benchmark-linting-error-count.json

echo $'CI: Testing linting error count...\n'
node run_linter.js "ci" $(ng lint | grep -c "ERROR: /") || exit

# upload to aws

