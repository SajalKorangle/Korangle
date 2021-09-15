from common.common_views_3 import APIView
from decorators import user_permission_3
from .cashfree import getSettlementsCycleList, ifscVerification, bankAccountVerification


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
    # @answer : In post data is encrypted. It was not required though but it will keep the data safe.
    def post(self, request, *args, **kwargs):
        return bankAccountVerification(**request.data)
