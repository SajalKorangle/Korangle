# greetings/urls.py
from django.conf.urls import url

'''from .views import new_fee_receipt_view, new_concession_view, concession_list_view,

from .fees import fee_list_view

from .marksheet import get_student_marksheet, update_student_marksheet, delete_student_marksheet'''

from .views import get_working_days_view, create_working_days_view, update_working_days_view, \
	get_bus_stops_view, get_session_list_view, SchoolProfileView

from .user import LoginUserView, UserDetailsView

urlpatterns = [

	url(r'^get-user-details/', UserDetailsView.as_view(), name="user_details"),
	url(r'^login-user-details/', LoginUserView.as_view(), name="login_user_details"),

	url(r'^(?P<school_id>[0-9]+)/working-days/?session-id=(?P<session_id>[0-9]+)', get_working_days_view),
	url(r'^working-days', create_working_days_view),
	url(r'^working-days/(?P<school_session_id>[0-9]+)', update_working_days_view),

	url(r'^(?P<school_id>[0-9]+)/bus-stops', get_bus_stops_view),

	url(r'^sessions', get_session_list_view),

	url(r'^(?P<school_id>[0-9]+)', SchoolProfileView.as_view()),
	url(r'^school-profile', SchoolProfileView.as_view()),

]
