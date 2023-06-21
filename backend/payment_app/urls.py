
from .views import OrderSchoolView, OrderSelfView, OrderListView, EaseBuzzOrderSelfView, EaseBuzzOrderSchoolView, EaseBuzzOrderSchoolView
from django.conf.urls import url, include

urlpatterns = [
    url(r'^cashfree/', include('payment_app.cashfree.urls')),
]


from .views import SchoolMerchantAccountView

urlpatterns += [
    url(r'^school-merchant-account', SchoolMerchantAccountView.as_view()),
]


urlpatterns += [
    url(r'^order-self/batch', OrderListView.as_view()),
    url(r'^order-school/batch', OrderListView.as_view()),
    url(r'^order-self', OrderSelfView.as_view()),
    url(r'^order-school', OrderSchoolView.as_view()),
    url(r'^easebuzz-order-self', EaseBuzzOrderSelfView.as_view()),
    url(r'^easebuzz-order-school', EaseBuzzOrderSchoolView.as_view()),
]
