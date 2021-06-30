from django.conf.urls import url

from .views import SettelmentsCycleListView, IFSCVerification, BankAccountVerification

urlpatterns = [
    url(r'^settelment-cycle', SettelmentsCycleListView.as_view()),
    url(r'^ifsc-verification', IFSCVerification.as_view()),
    url(r'^bank-account-verification', BankAccountVerification.as_view()),
]
