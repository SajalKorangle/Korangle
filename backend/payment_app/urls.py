
from django.conf.urls import url, include

urlpatterns = [
    url(r'^cashfree/', include('payment_app.cashfree.urls')),
]


from .views import SchoolMerchantAccount

urlpatterns += [
    url(r'^school-merchant-account', SchoolMerchantAccount.as_view()),
]

from .views import OrderSchoolView, OrderSelfView, OrderListView

urlpatterns += [
    url(r'^order-self/batch', OrderListView.as_view()),
    url(r'^order-school/batch', OrderListView.as_view()),
    url(r'^order-self', OrderSelfView.as_view()),
    url(r'^order-school', OrderSchoolView.as_view()),
]
