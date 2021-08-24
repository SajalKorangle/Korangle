for app in ./*_app/
do
    echo $app
    rm -r "${app}migrations"
    rm -r "${app}db_script"
done

rm -r report_card_app/report_card_cbse_app/migrations
rm -r report_card_app/report_card_cbse_app/db_script
rm -r report_card_app/report_card_mp_board_app/migrations
rm -r report_card_app/report_card_mp_board_app/db_script