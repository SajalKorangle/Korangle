for app in ./*_app/
do
    echo $app
    rm -r "${app}migrations"
done

rm -r report_card_app/report_card_cbse_app/migrations
rm -r report_card_app/report_card_mp_board_app/migrations