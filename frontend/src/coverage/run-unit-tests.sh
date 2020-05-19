
# Create Dummy Spec file to include all modules and their files
find src/app/ -name '*.module.ts' > src/dummy.spec.ts
sed -i "s/^src\/app/import '.\/app/g" src/dummy.spec.ts
sed -i "s/\.ts$/\\';/g" src/dummy.spec.ts

# Running unit tests
npm run unit-tests

# Copying benchmark coverage from s3
aws s3 cp s3://korangleplus/benchmark-coverage.json src/coverage

# Checking Coverage
npm run check-coverage

# Uploading benchmark coverage to s3
aws s3 cp src/coverage/new-coverage.json s3://korangleplus/benchmark-coverage.json
