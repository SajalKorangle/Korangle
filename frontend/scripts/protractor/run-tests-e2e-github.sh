
start=$SECONDS

mkdir -p tmp

# Running tests (using protractor)
ng e2e --port=4200

# Total Run time
echo "Total Run Time: $((SECONDS - start))"
