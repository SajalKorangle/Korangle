
start=$SECONDS

rm -rf tmp/local-checks-result

sh scripts/karma/run-tests-karma-locally.sh
if [ "$?" -ne 0 ]; then
    echo "Karma Test failed." >> tmp/local-checks-result
fi

sh scripts/protractor/run-tests-e2e-locally.sh
if [ "$?" -ne 0 ]; then
    echo "Protractor Test failed." >> tmp/local-checks-result
fi

sh scripts/protractor/check-coverage-e2e-locally.sh
if [ "$?" -ne 0 ]; then
    echo "Protractor Coverage Failed" >> tmp/local-checks-result
fi

node ./scripts/feature/check-feature-coverage.js local
if [ "$?" -ne 0 ]; then
    echo "Feature Coverage Failed" >> tmp/local-checks-result
fi

i="tmp/local-checks-result"
if [ -f "$i" ]; then
    echo ""
    cat tmp/local-checks-result
    echo ""
else
    echo ""
    echo "All checks passed!!!"
    echo ""
fi

echo ""
echo "Total Duration: $((SECONDS - start))"
echo ""
