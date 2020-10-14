
for i in `find src/app -name '*.component.ts'`;
do
    featureFile="tests/features${i:7}"
    featureFile="tests/features${i:7}"
    echo $featureFile
    # echo ${i:7}
done
