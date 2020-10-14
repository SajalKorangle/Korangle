
createDirectory()
{
    if [ ! -f "$1" ]; then
        directoryName=$(dirname "$1")
        mkdir -p $directoryName
        echo $directoryName
    fi
}

for i in `find src/app -name '*.component.ts'`;
do
    trimmed=${i:7}
    featureFile="tests/features${trimmed/component.ts/json}"
    fixtureFile="tests/fixtures${trimmed/component.ts/json}"
    protractorTestFile="tests/protractor/src${trimmed/component.ts/e2e-spec.ts}"
    karmaTestFile="tests/karma/test${trimmed/component.ts/spec.ts}"

    createDirectory $featureFile
    createDirectory $fixtureFile
    createDirectory $protractorTestFile
    createDirectory $karmaTestFile

done

