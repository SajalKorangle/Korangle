
mkdir -p tmp

# Create a fake environment.prod.ts
if [ "$1" = "github" ]; then
    cp src/environments/environment.ts src/environments/environment.prod.ts
fi

# Create Dummy Spec file to include all modules and their files
find src/app/ -name '*.module.ts' > tests/karma/dummy.spec.ts
if [ "$1" = "github" ]; then
    sed -i "s/^src\/app/import '..\/..\/src\/app/g" tests/karma/dummy.spec.ts
    sed -i "s/\.ts$/\\';/g" tests/karma/dummy.spec.ts
else
    sed -i "" "s/^src\/app/import '..\/..\/src\/app/g" tests/karma/dummy.spec.ts
    sed -i "" "s/\.ts$/\\';/g" tests/karma/dummy.spec.ts
fi

# Running unit tests
npm run test
if [ "$?" -ne 0 ];
then
    echo 'karma Test failed'
    exit 1
fi


#####################################
#           Coverage                #
#####################################

# For now we are moving away from the coverage of karma tests
exit 0;

# Calculating total number of test cases
numberOfTests=0
for i in `find tests/karma/test -name "*.spec.ts"`
do
    newTestCounter=`grep -v '//' $i | grep -v '/\*' | grep -c 'it('`
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
}" > tmp/karma-coverage-data.json

# Checking Coverage
if [ "$1" = "github" ]; then

    node scripts/karma/check-coverage.js github

    # Uploading benchmark coverage to s3
    aws s3 cp karma-coverage.json s3://korangleplus/benchmark-karma-coverage.json

else

    node scripts/karma/check-coverage.js local

fi
