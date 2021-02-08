from common.common_views_file import CommonView, CommonListView
from rest_framework.views import APIView

# Create your views here.
from .models import Heads

class HeadsView(CommonView ,APIView):
    Model = Heads

class HeadsListView(CommonListView ,APIView):
    Model = Heads

from .models import EmployeeAmountPermission

class EmployeeAmountPermissionView(CommonView ,APIView):
    Model = EmployeeAmountPermission

class EmployeeAmountPermissionListView(CommonListView ,APIView):
    Model = EmployeeAmountPermission

from .models import Accounts

class AccountsView(CommonView, APIView):
    Model = Accounts

class AccountsListView(CommonListView, APIView):
    Model = Accounts

from .models import AccountSession

class AccountSessionView(CommonView, APIView):
    Model = AccountSession

class AccountSessionListView(CommonListView, APIView):
    Model = AccountSession

from .models import Transaction

class TransactionView(CommonView, APIView):
    Model = Transaction

class TransactionListView(CommonListView, APIView):
    Model = Transaction

from .models import TransactionImages

class TransactionImagesView(CommonView, APIView):
    Model = TransactionImages

class TransactionImagesListView(CommonListView, APIView):
    Model = TransactionImages

from .models import TransactionAccountDetails

class TransactionAccountDetailsView(CommonView, APIView):
    Model = TransactionAccountDetails

class TransactionAccountDetailsListView(CommonListView, APIView):
    Model = TransactionAccountDetails

from .models import ApprovalRequests

class ApprovalRequestsView(CommonView, APIView):
    Model = ApprovalRequests

class ApprovalRequestsListView(CommonListView, APIView):
    Model = ApprovalRequests
