
start=$SECONDS

mkdir -p tmp

# Running tests (using protractor)
npm run e2e

# Total Run time
echo "Total Run Time: $((SECONDS - start))"
