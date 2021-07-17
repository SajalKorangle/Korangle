for app in ./*_app/
do
    echo $app
    mkdir "${app}migrations/"
    touch "${app}migrations/__init__.py"
done

#Report Card App
mkdir report_card_app/report_card_cbse_app/migrations
touch report_card_app/report_card_cbse_app/migrations/__init__.py
mkdir report_card_app/report_card_mp_board_app/migrations
touch report_card_app/report_card_mp_board_app/migrations/__init__.py