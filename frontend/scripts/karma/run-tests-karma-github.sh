
mkdir -p tmp

# Create a fake environment.prod.ts
cp src/environments/environment.ts src/environments/environment.prod.ts

# Create Dummy Spec file to include all modules and their files
find src/app/ -name '*.module.ts' > tests/karma/dummy.spec.ts
sed -i "" "s/^src\/app/import '..\/..\/src\/app/g" tests/karma/dummy.spec.ts
sed -i "" "s/\.ts$/\\';/g" tests/karma/dummy.spec.ts

# Running unit tests
ng test --code-coverage --no-watch


#####################################
#           Coverage                #
#####################################

# Calculating total number of test cases
numberOfTests=0
for i in `find tests/karma/test -name "*.e2e-spec.ts"`
do
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
}" > tmp/karma-coverage-data.json

# Checking Coverage
node scripts/karma/check-coverage-karma.js github

# Uploading benchmark coverage to s3
aws s3 cp karma-coverage.json s3://korangleplus/benchmark-karma-coverage.json
