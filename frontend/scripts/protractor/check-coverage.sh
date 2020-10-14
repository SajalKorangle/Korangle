
mkdir -p tmp

# Calculating total number of semi colons in tests.
# Calculating total number of test cases
numberOfSemiColonInTests=0
numberOfTests=0
for i in `find tests/protractor/src -name "*.e2e-spec.ts"`
do

    newSemiColonCount=`grep -v '//' $i | grep -c ';'`
    numberOfSemiColonInTests=$((newSemiColonCount + numberOfSemiColonInTests))

    newTestCounter=`grep -v '//' $i | grep -v '/\*' | grep -c 'it('`
    numberOfTests=$((newTestCounter + numberOfTests))

done;

# Calculating total number of semi colons in application.
numberOfSemiColonInApplication=0
for i in `find src/app -name "*.ts" -o -name "*.js"`
do
    newCount=`grep -v '//' $i | grep -c ';'`
    numberOfSemiColonInApplication=$((newCount + numberOfSemiColonInApplication))
done;

# Calculating total number of components in application.
numberOfComponents=0
for i in `find src/app -name "*.component.ts"`
do
    numberOfComponents=$((numberOfComponents + 1))
done;

echo "{
 \"numberOfSemiColonInTests\": $numberOfSemiColonInTests,
 \"numberOfTests\": $numberOfTests,
 \"numberOfSemiColonInApplication\": $numberOfSemiColonInApplication,
 \"numberOfComponents\": $numberOfComponents
}" > tmp/protractor-coverage-data.json

# Checking Coverage
if [ "$1" = "github" ]; then

    node scripts/protractor/check-coverage.js github

    # Uploading benchmark coverage to s3
    aws s3 cp protractor-coverage.json s3://korangleplus/benchmark-protractor-coverage.json

else

    node scripts/protractor/check-coverage.js local

fi
