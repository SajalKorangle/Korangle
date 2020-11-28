if [ "$#" -ne 1 ]; then
    echo "You must provide the path of component file and don't provide any other argument"
    exit 1
fi

if [ ! -f $1 ]; then
    echo "$1 file doesn't exist"
    exit 1
fi

createDirectory()
{
    if [ ! -f "$1" ]; then
        directoryName=$(dirname "$1")
        mkdir -p $directoryName
        touch $1
        echo $directoryName
    fi
}

i=$1

trimmed=${i:7}
featureFile="tests/features${trimmed/component.ts/json}"
fixtureFile="tests/fixtures${trimmed/component.ts/json}"
protractorTestFile="tests/protractor/src${trimmed/component.ts/e2e-spec.ts}"
# karmaTestFile="tests/karma/test${trimmed/component.ts/spec.ts}"

createDirectory $featureFile
createDirectory $fixtureFile
createDirectory $protractorTestFile
# createDirectory $karmaTestFile
