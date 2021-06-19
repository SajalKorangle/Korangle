from django.conf.urls import url

from fees_third_app.models import Order

from .views import SettelmentsCycleListView, IFSCVerification, BankAccountVerification

urlpatterns = [
    url(r'^settelment-cycle', SettelmentsCycleListView.as_view()),
    url(r'^ifsc-verification', IFSCVerification.as_view()),
    url(r'^bank-account-verification', BankAccountVerification.as_view()),
]

from fees_third_app.cashfree.views import OnlinePaymentAccountView

urlpatterns += [
    url(r'^online-payment-account', OnlinePaymentAccountView.as_view()),
]


from fees_third_app.cashfree.views import CashfreeTransactionView, CashfreeTransactionListView

urlpatterns += [
    url(r'^cashfree-transaction/batch', CashfreeTransactionListView.as_view()),
    url(r'^cashfree-transaction', CashfreeTransactionView.as_view()),
]


from fees_third_app.cashfree.views import OrderCompletionView

urlpatterns += [
    url(r'^order-completion', OrderCompletionView.as_view()),
]

from fees_third_app.cashfree.views import OrderView

urlpatterns += [
    url(r'^order', OrderView.as_view()),
]