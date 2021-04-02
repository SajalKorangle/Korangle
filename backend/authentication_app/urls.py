from django.conf.urls import url

urlpatterns = []


from authentication_app.views import GenerateOTPForSignupView
from authentication_app.views import VerifyOTPForSignupView

urlpatterns += [

    url(r'^generate-otp-for-signup', GenerateOTPForSignupView.as_view()),
    url(r'^verify-otp-for-signup', VerifyOTPForSignupView.as_view())

]


from authentication_app.views import GenerateOTPView
from authentication_app.views import VerifyOTPView

urlpatterns += [

    url(r'^generate-otp', GenerateOTPView.as_view()),
    url(r'^verify-otp', VerifyOTPView.as_view())

]
