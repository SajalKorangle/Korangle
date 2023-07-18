
# greetings/urls.py
from django.conf.urls import url

urlpatterns = []

########## Update Profile #############
from .views import get_class_section_student_list_view, get_student_profile_view, update_student_view, delete_student_view
urlpatterns += [
    url(r'^class_section_student_list/school/(?P<school_id>[0-9]+)/sessions/(?P<session_id>[0-9]+)', get_class_section_student_list_view),
    url(r'^get_student_profile/', get_student_profile_view),
    url(r'^update_student_profile/', update_student_view),
    url(r'^delete_student/', delete_student_view),
]

########## New Student ###########
'''from .views import create_new_student_view
urlpatterns += [
    url(r'^create_new_student/', create_new_student_view),
]'''

####################################
####### Trying Rest Api Below ######
####################################

######## Student Full Profile ######
from .views import StudentFullProfileListView, StudentFullProfileView
urlpatterns += [
    url(r'^student-full-profiles/(?P<student_id>[0-9]+)', StudentFullProfileView.as_view()),
    url(r'^student-full-profiles/batch', StudentFullProfileListView.as_view()),
    url(r'^school/(?P<school_id>[0-9]+)/student-full-profiles', StudentFullProfileListView.as_view()),
    url(r'^student-full-profiles/(?P<student_id>[0-9]+)', StudentFullProfileView.as_view()),
]

######## Student Mini Profile ######
from .views import StudentMiniProfileView
urlpatterns += [
    url(r'^school/(?P<school_id>[0-9]+)/student-mini-profiles', StudentMiniProfileView.as_view()),
]

######## Student Section ###########
from .views import StudentSectionOldView
urlpatterns += [
    url(r'^student-sections-old/(?P<student_section_id>[0-9]+)', StudentSectionOldView.as_view()),
    # url(r'^student-sections-old/batch', StudentSectionListOldView.as_view()),
]

######## Profile Image ############
from .views import ProfileImageView
urlpatterns += [
    url(r'^(?P<student_id>[0-9]+)/profile-image', ProfileImageView.as_view()),
]

######## Transfer certificate ######
from .views import TransferCertificateView
urlpatterns += [
    url(r'^transfer-certificates/(?P<transfer_certificate_id>[0-9]+)', TransferCertificateView.as_view()),
    url(r'^transfer-certificates', TransferCertificateView.as_view()),
]


####################################
##### Trying Common Views Below ####
####################################

# from student_app.views import StudentView2
# urlpatterns += [
#     url(r'^students-2', StudentView2.as_view()),
# ]

from student_app.views import StudentView, StudentListView

urlpatterns += [
    url(r'^students/batch', StudentListView.as_view()),
    url(r'^students', StudentView.as_view()),
]


from student_app.views import StudentSectionView, StudentSectionListView

urlpatterns += [
    url(r'^student-sections/batch', StudentSectionListView.as_view()),
    url(r'^student-sections', StudentSectionView.as_view()),
]


from student_app.views import StudentParameterValueView, StudentParameterValueListView

urlpatterns += [
    url(r'^student-parameter-value/batch', StudentParameterValueListView.as_view()),
    url(r'^student-parameter-value', StudentParameterValueView.as_view()),
]


from student_app.views import StudentParameterView, StudentParameterListView

urlpatterns += [
    url(r'^student-parameter/batch', StudentParameterListView.as_view()),
    url(r'^student-parameter', StudentParameterView.as_view()),
]

