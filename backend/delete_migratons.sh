for app in ./*_app/
do
    echo $app
    rm -r "${app}migrations"
done
