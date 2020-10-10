# Metrics
# number Of semicolons vs number of semicolons (watching for number of statements)
# number of test it vs number of components (if the files are increasing so should number of test cases)

mkdir -p tmp

numberOfTests=0
for i in `find tests/protractor/src -name "*.e2e-spec.ts"`
do

    newSemiColonCount=`grep -v '//' $i | grep -c ';'`
    numberOfSemiColonInTests=$((newSemiColonCount + numberOfSemiColonInTests))

    newTestCounter=`grep -v '//' $i | grep -c 'it('`
    numberOfTests=$((newTestCounter + numberOfTests))

done;

# Calculating total number of components in application.
numberOfComponents=0
for i in `find src/app -name "*.component.ts"`
do
    numberOfComponents=$((numberOfComponents + 1))
done;

echo "{
 \"numberOfTests\": $numberOfTests,
 \"numberOfComponents\": $numberOfComponents
}" > tmp/feature-coverage-data.json

# Checking Coverage
node scripts/feature/check-feature-coverage.js github

# Uploading benchmark coverage to s3
aws s3 cp feature-coverage.json s3://korangleplus/benchmark-feature-coverage.json
