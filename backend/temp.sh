# for app in ./*_app/
# do
#     echo $app
#     mkdir "old-migrations/${app}"
#     mv "${app}migrations" "old-migrations/${app}migrations"
#     mv "${app}db_script" "old-migrations/${app}/db_script"
# done

# for app in ./*_app/
# do
#     echo $app
#     rm -r "${app}migrations"
# done

for app in ./*_app/
do
    echo $app
    mkdir "${app}migrations/"
    touch "${app}migrations/__init__.py"
done