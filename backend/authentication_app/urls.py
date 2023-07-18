from django.conf.urls import url

urlpatterns = []

from authentication_app.views import GenerateOTPView

urlpatterns += [
    url(r'^generate-otp', GenerateOTPView.as_view()),
]

from authentication_app.views import VerifyOTPAndChangePasswordView,\
    VerifyOTPAndCreateSchool, VerifyOTPAndSignupView

urlpatterns += [
    url(r'^verify-otp-and-signup', VerifyOTPAndSignupView.as_view()),
    url(r'^verify-otp-and-change-password', VerifyOTPAndChangePasswordView.as_view()),
    url(r'^verify-otp-and-create-school', VerifyOTPAndCreateSchool.as_view()),
]
