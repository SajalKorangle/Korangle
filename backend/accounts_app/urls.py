from django.conf.urls import url

urlpatterns = []

from .views import HeadsListView, HeadsView
from .views import TransactionAccountDetailsListView, TransactionAccountDetailsView
from .views import TransactionListView, TransactionView
from .views import AccountsView, AccountsListView
from .views import AccountSessionView, AccountSessionListView
from .views import EmployeeAmountPermissionListView, EmployeeAmountPermissionView
from .views import ApprovalRequestsListView, ApprovalRequestsView
from .views import TransactionImagesListView, TransactionImagesView

urlpatterns += [
    url(r'^transaction-account-details/batch', TransactionAccountDetailsListView.as_view()),
    url(r'^transaction-account-details', TransactionAccountDetailsView.as_view()),
]

urlpatterns += [
    url(r'^transaction-images/batch', TransactionImagesListView.as_view()),
    url(r'^transaction-images', TransactionImagesView.as_view()),
]

urlpatterns += [
    url(r'^transaction/batch', TransactionListView.as_view()),
    url(r'^transaction', TransactionView.as_view()),
]

urlpatterns += [
    url(r'^account-session/batch', AccountSessionListView.as_view()),
    url(r'^account-session', AccountSessionView.as_view()),
]


urlpatterns += [
    url(r'^approval-requests/batch', ApprovalRequestsListView.as_view()),
    url(r'^approval', ApprovalRequestsView.as_view()),
]


urlpatterns += [
    url(r'^accounts/batch', AccountsListView.as_view()),
    url(r'^accounts', AccountsView.as_view()),
]

urlpatterns += [
    url(r'^heads/batch', HeadsListView.as_view()),
    url(r'^heads', HeadsView.as_view()),
]

urlpatterns += [
    url(r'^employee-amount-permission/batch', EmployeeAmountPermissionListView.as_view()),
    url(r'^employee-amount-permission', EmployeeAmountPermissionView.as_view()),
]