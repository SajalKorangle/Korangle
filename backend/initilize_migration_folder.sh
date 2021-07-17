for app in ./*_app/
do
    echo $app
    mkdir "${app}migrations/"
    touch "${app}migrations/__init__.py"
done