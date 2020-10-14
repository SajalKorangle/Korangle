for i in `find tests -empty -name '*.e2e-spec.ts'`;
do
    rm $i
done
