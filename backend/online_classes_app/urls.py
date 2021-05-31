
from django.conf.urls import url

urlpatterns = []


from online_classes_app import views

urlpatterns += [
    url(r'^online-class/batch', views.OnlineClassListView.as_view()),
    url(r'^online-class', views.OnlineClassView.as_view()),
    url(r'^account-info/batch', views.AccountInfoListView.as_view()),
    url(r'^account-info', views.AccountInfoView.as_view()),
    url(r'^restricted-students/batch', views.RestrictedStudentListView.as_view()),
    url(r'^restricted-students', views.RestrictedStudentView.as_view()),
    url(r'^student-attendance/batch', views.StudenAttendanceListView.as_view()),
    url(r'^student-attendance', views.StudentAttendanceView.as_view()),
    url(r'^zoom-meeting-signature', views.ZoomMeetingSignature.as_view()),
]



