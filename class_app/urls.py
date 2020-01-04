from django.conf.urls import url

from .views import ClassTeacherSignatureView, ClassTeacherSignatureListView

urlpatterns = [
    url(r'^class-teacher-signature/batch', ClassTeacherSignatureListView.as_view()),
    url(r'^class-teacher-signature', ClassTeacherSignatureView.as_view()),
]
