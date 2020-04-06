
from django.conf.urls import url, include


urlpatterns = [

    url(r'^cbse/', include('report_card_app.report_card_cbse_app.urls')),
    url(r'^mp-board/', include('report_card_app.report_card_mp_board_app.urls')),

]

