# Metrics
# number Of semicolons vs number of semicolons (watching for number of statements)
# number of test it vs number of components (if the files are increasing so should number of test cases)

mkdir -p tmp

numberOfProtractorTests=0
for i in `find tests/protractor/src -name "*.e2e-spec.ts"`
do
    newTestCounter=`grep -v '//' $i | grep -v '/\*' | grep -c 'it('`
    numberOfProtractorTests=$((newTestCounter + numberOfProtractorTests))
done;

numberOfKarmaTests=0
for i in `find tests/karma/test -name "*.spec.ts"`
do
    newTestCounter=`grep -v '//' $i | grep -v '/\*' | grep -c 'it('`
    numberOfKarmaTests=$((newTestCounter + numberOfKarmaTests))
done;

# Calculating total number of components in application.
numberOfComponents=0
for i in `find src/app -name "*.component.ts"`
do
    numberOfComponents=$((numberOfComponents + 1))
done;

echo "{
 \"numberOfProtractorTests\": $numberOfProtractorTests,
 \"numberOfKarmaTests\": $numberOfKarmaTests,
 \"numberOfComponents\": $numberOfComponents
}" > tmp/feature-coverage-data.json

# Checking Coverage
if [ "$1" = "github" ]; then

    node scripts/feature/check-feature-coverage.js github

    # Uploading benchmark coverage to s3
    aws s3 cp feature-coverage.json s3://korangleplus/benchmark-feature-coverage.json

else

    node scripts/feature/check-feature-coverage.js local

fi
