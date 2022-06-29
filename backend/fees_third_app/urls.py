from django.conf.urls import url

urlpatterns = []

from fees_third_app.views import FeeTypeView, FeeTypeListView

urlpatterns += [
    url(r'^fee-types/batch', FeeTypeListView.as_view()),
    url(r'^fee-types', FeeTypeView.as_view()),
]


from fees_third_app.views import SchoolFeeRuleView, SchoolFeeRuleListView

urlpatterns += [
    url(r'^school-fee-rules/batch', SchoolFeeRuleListView.as_view()),
    url(r'^school-fee-rules', SchoolFeeRuleView.as_view()),
]


from fees_third_app.views import ClassFilterFeeView, ClassFilterFeeListView

urlpatterns += [
    url(r'^class-filter-fees/batch', ClassFilterFeeListView.as_view()),
    url(r'^class-filter-fees', ClassFilterFeeView.as_view()),
]


from fees_third_app.views import BusStopFilterFeeView, BusStopFilterFeeListView

urlpatterns += [
    url(r'^bus-stop-filter-fees/batch', BusStopFilterFeeListView.as_view()),
    url(r'^bus-stop-filter-fees', BusStopFilterFeeView.as_view()),
]


from fees_third_app.views import StudentFeeView, StudentFeeListView

urlpatterns += [
    url(r'^student-fees/batch', StudentFeeListView.as_view()),
    url(r'^student-fees', StudentFeeView.as_view()),
]


from fees_third_app.views import FeeReceiptView, FeeReceiptListView

urlpatterns += [
    url(r'^fee-receipts/batch', FeeReceiptListView.as_view()),
    url(r'^fee-receipts', FeeReceiptView.as_view()),
]


from fees_third_app.views import SubFeeReceiptView, SubFeeReceiptListView

urlpatterns += [
    url(r'^sub-fee-receipts/batch', SubFeeReceiptListView.as_view()),
    url(r'^sub-fee-receipts', SubFeeReceiptView.as_view()),
]


from fees_third_app.views import DiscountView, DiscountListView

urlpatterns += [
    url(r'^discounts/batch', DiscountListView.as_view()),
    url(r'^discounts', DiscountView.as_view()),
]


from fees_third_app.views import SubDiscountView, SubDiscountListView

urlpatterns += [
    url(r'^sub-discounts/batch', SubDiscountListView.as_view()),
    url(r'^sub-discounts', SubDiscountView.as_view()),
]


from .views import FeeSettingsView, FeeSettingsListView, FeeSchoolSettingsListView, FeeSchoolSettingsView

urlpatterns += [
    url(r'^fee-settings/batch', FeeSettingsListView.as_view()),
    url(r'^fee-settings', FeeSettingsView.as_view()),
    url(r'^fee-school-settings/batch', FeeSchoolSettingsListView.as_view()),
    url(r'^fee-school-settings', FeeSchoolSettingsView.as_view()),
]

from .views import FeeReceiptOrderView, FeeReceiptOrderListView
urlpatterns += [
    url(r'^fee-receipt-order/batch', FeeReceiptOrderListView.as_view()),
    url(r'^fee-receipt-order', FeeReceiptOrderView.as_view()),
]
