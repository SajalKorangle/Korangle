
# Create a fake environment.prod.ts
cp src/environments/environment.ts src/environments/environment.prod.ts

# Create Dummy Spec file to include all modules and their files
find src/app/ -name '*.module.ts' > src/dummy.spec.ts
sed -i "" "s/^src\/app/import '.\/app/g" src/dummy.spec.ts
sed -i "" "s/\.ts$/\\';/g" src/dummy.spec.ts

# Running unit tests
npm run unit-tests

# Checking Coverage
npm run check-coverage-locally

