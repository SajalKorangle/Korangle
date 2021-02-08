# for CI platform only

echo $'CI: Testing linting error count...\n'
node run_linter.js "ci" $(ng lint | grep -c "ERROR: /")

# upload to aws

