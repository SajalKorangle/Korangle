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

from .models import Approval

class ApprovalView(CommonView, APIView):
    Model = Approval

class ApprovalListView(CommonListView, APIView):
    Model = Approval


from .models import ApprovalImages

class ApprovalImagesView(CommonView, APIView):
    Model = ApprovalImages

class ApprovalImagesListView(CommonListView, APIView):
    Model = ApprovalImages

from .models import ApprovalAccountDetails

class ApprovalAccountDetailsView(CommonView, APIView):
    Model = ApprovalAccountDetails

class ApprovalAccountDetailsListView(CommonListView, APIView):
    Model = ApprovalAccountDetails


from .models import LockAccounts

class LockAccountsView(CommonView, APIView):
    Model = LockAccounts

class LockAccountsListView(CommonListView,  APIView):
    Model = LockAccounts