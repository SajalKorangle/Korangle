
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

api_version = 'v3.0/'

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^'+api_version+'school/', include('school_app.urls')),
    url(r'^'+api_version+'student/', include('student_app.urls')),
    url(r'^'+api_version+'expense/', include('expense_app.urls')),
    url(r'^'+api_version+'class/', include('class_app.urls')),
    url(r'^'+api_version+'fees/', include('fees_third_app.urls')),
    url(r'^'+api_version+'subjects/', include('subject_app.urls')),
    url(r'^'+api_version+'examinations/', include('examination_app.urls')),
    url(r'^'+api_version+'team/', include('team_app.urls')),
    url(r'^'+api_version+'employee/', include('employee_app.urls')),
    url(r'^'+api_version+'enquiry/', include('enquiry_app.urls')),
    url(r'^'+api_version+'sms/', include('sms_app.urls')),
    url(r'^'+api_version+'vehicle/', include('vehicle_app.urls')),
    url(r'^'+api_version+'attendance-old/', include('attendance_app.urls_old')),
    url(r'^'+api_version+'attendance/', include('attendance_app.urls')),
    url(r'^'+api_version+'salary/', include('salary_app.urls')),
    url(r'^'+api_version+'user/', include('user_app.urls')),
    url(r'^'+api_version+'subject/', include('subject_app.urls')),
    url(r'^'+api_version+'notification/', include('notification_app.urls')),
    url(r'^'+api_version+'report-card/', include('report_card_app.urls')),
    url(r'^'+api_version+'custom_reportcard/', include('report_card.custom_reportcard.urls')),
    url(r'^'+api_version+'grade/', include('grade_app.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

