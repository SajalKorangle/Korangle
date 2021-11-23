from django.conf.urls import url

urlpatterns = []

from authentication_app.views import GenerateOTPView

urlpatterns += [
    url(r'^generate-otp', GenerateOTPView.as_view()),
]

from authentication_app.views import VerifyOTPForPasswordView,\
    VerifyOTPForCreateSchool, VerifyOTPForSignupView

urlpatterns += [
    url(r'^verify-otp-for-signup', VerifyOTPForSignupView.as_view()),
    url(r'^verify-otp-for-password', VerifyOTPForPasswordView.as_view()),
    url(r'^verify-otp-for-create-school', VerifyOTPForCreateSchool.as_view()),
]
