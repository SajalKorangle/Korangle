
mkdir -p tmp

# Create Dummy Spec file to include all modules and their files
find src/app/ -name '*.module.ts' > tests/karma/dummy.spec.ts
sed -i "" "s/^src\/app/import '..\/..\/src\/app/g" tests/karma/dummy.spec.ts
sed -i "" "s/\.ts$/\\';/g" tests/karma/dummy.spec.ts

# Running unit tests
ng test --code-coverage --no-watch
if [ "$?" -ne 0 ];
then
    echo 'karma Test failed'
    exit 1
fi

#####################################
#           Coverage                #
#####################################

# Calculating total number of test cases
numberOfTests=0
for i in `find tests/karma/test -name "*.spec.ts"`
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
node scripts/karma/check-coverage-karma.js local
