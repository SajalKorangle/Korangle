from common.common_views_3 import APIView
from decorators import user_permission_3
from .cashfree import getSettlementsCycleList, ifscVerification, bankVerification

class SettlementsCycleListView(APIView):

    @user_permission_3
    def get(self, request, *args, **kwargs):
        return getSettlementsCycleList()   


class IFSCVerification(APIView):

    @user_permission_3
    def get(self, request, *args, **kwargs):
        return ifscVerification(**request.GET.dict())


class BankAccountVerification(APIView):

    @user_permission_3
    # Code Review
    # jab sab jagah baaki jagah get chal raha tha to yahan par post kyun kiya?
    def post(self, request, *args, **kwargs):
        return bankVerification(**request.data)
