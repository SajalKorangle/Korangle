from django.conf.urls import url

urlpatterns = []


######## Msg Club Delivery Report ###############
from .views import handle_msg_club_delivery_report_view

urlpatterns += [
	url(r'^handle-msg-club-delivery-report', handle_msg_club_delivery_report_view),
]

