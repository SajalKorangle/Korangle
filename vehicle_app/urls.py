from django.conf.urls import url

urlpatterns = []

######## Enquiry ###############
from .views import BusStopView, BusStopListView

urlpatterns += [
	url(r'^bus-stops$', BusStopView.as_view()),
	url(r'^bus-stops/(?P<bus_stop_id>[0-9]+)', BusStopView.as_view()),
	url(r'^school/(?P<school_id>[0-9]+)/bus-stops', BusStopListView.as_view()),
]
