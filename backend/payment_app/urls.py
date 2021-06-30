
from django.conf.urls import url, include

urlpatterns = [
     url(r'^cashfree/', include('payment_app.cashfree.urls')),
]




from .views import OnlinePaymentAccountView

urlpatterns += [
    url(r'^online-payment-account', OnlinePaymentAccountView.as_view()),
]

from .views import OrderCompletionView

urlpatterns += [
    url(r'^order-completion', OrderCompletionView.as_view()),
]

from .views import OrderView

urlpatterns += [
    url(r'^order', OrderView.as_view()),
]


