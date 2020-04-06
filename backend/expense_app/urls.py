from django.conf.urls import url

from .views import new_expense_view, expense_list_date_wise_view

urlpatterns = [
    url(r'^new_expense/', new_expense_view),
    url(r'^expense_list/', expense_list_date_wise_view),
]
