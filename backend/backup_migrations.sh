mkdir old-migrations
for app in ./*_app/
do
    echo $app
    mkdir "old-migrations/${app}"
    mv "${app}migrations" "old-migrations/${app}migrations"
    mv "${app}db_script" "old-migrations/${app}/db_script"
done

# RC Migrations
mkdir old-migrations/report_card_app/report_card_cbse_app/
mkdir old-migrations/report_card_app/report_card_mp_board_app/
mv report_card_app/report_card_cbse_app/migrations old-migrations/report_card_app/report_card_cbse_app/migrations
mv report_card_app/report_card_cbse_app/db_script old-migrations/report_card_app/report_card_cbse_app/db_script
mv report_card_app/report_card_mp_board_app/migrations old-migrations/report_card_app/report_card_mp_board_app/migrations
mv report_card_app/report_card_mp_board_app/db_script old-migrations/report_card_app/report_card_mp_board_app/db_script
