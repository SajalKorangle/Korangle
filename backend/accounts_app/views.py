from common.common_views_3 import CommonView, CommonListView
from rest_framework.views import APIView
from django.db.models.signals import pre_delete, pre_save, post_save, post_delete


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

from school_app.model.models import Session

def updateCurrentBalanceOnTransactionAccountDetailsSave(sender, instance, **kwargs):
    session_object = \
        Session.objects.get(startDate__lte=instance.parentTransaction.transactionDate,
                            endDate__gte=instance.parentTransaction.transactionDate)
    account_session_object = \
        AccountSession.objects.get(parentAccount=instance.parentAccount, parentSession=session_object)

    if instance.id is None:
        if instance.transactionType == 'CREDIT':
            account_session_object.currentBalance -= instance.amount
        if instance.transactionType == 'DEBIT':
            account_session_object.currentBalance += instance.amount
    else:
        if instance.transactionType == 'CREDIT':
            account_session_object.currentBalance -= instance.amount - TransactionAccountDetails.objects.get(id=instance.id).amount
        if instance.transactionType == 'DEBIT':
            account_session_object.currentBalance += instance.amount - TransactionAccountDetails.objects.get(id=instance.id).amount
    account_session_object.save()


def updateCurrentBalanceOnTransactionAccountDetailsDelete(sender, instance, **kwargs):
    session_object = \
        Session.objects.get(startDate__lte=instance.parentTransaction.transactionDate,
                            endDate__gte=instance.parentTransaction.transactionDate)
    account_session_object = \
        AccountSession.objects.get(parentAccount=instance.parentAccount, parentSession=session_object)
    if instance.transactionType == 'CREDIT':
        account_session_object.currentBalance += instance.amount
    if instance.transactionType == 'DEBIT':
        account_session_object.currentBalance -= instance.amount
    account_session_object.save()

pre_save.connect(updateCurrentBalanceOnTransactionAccountDetailsSave, sender=TransactionAccountDetails)
post_delete.connect(updateCurrentBalanceOnTransactionAccountDetailsDelete, sender=TransactionAccountDetails)


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