from common.common_views_3 import CommonView, CommonListView, APIView
from common.common_serializer_interface_3 import get_object, get_list
from tc_app.models import TCLayout, TCLayoutSharing, TCImageAssets, TransferCertificateNew, TransferCertificateSettings
from decorators import user_permission_3
from django.db.models import Q



class TCLayoutView(CommonView, APIView):
    Model = TCLayout
    RelationsToSchool = ['parentSchool__id']

    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        layoutSharingList = TCLayoutSharing.objects.filter(parentSchool=activeSchoolID)
        sharedLayouts = list(map(lambda o:o.parentLayout.id, list(layoutSharingList)))
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        filtered_query_set = (filtered_query_set | self.Model.objects.filter(Q(publiclyShared=True) | Q(id__in=sharedLayouts))).distinct()  # extending filtered query set
        return get_object(request.GET, filtered_query_set, self.ModelSerializer)
            

class TCLayoutListView(CommonListView, APIView):
    Model = TCLayout
    RelationsToSchool = ['parentSchool__id']

    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        layoutSharingList = TCLayoutSharing.objects.filter(parentSchool=activeSchoolID)
        sharedLayouts = list(map(lambda o:o.parentLayout.id, list(layoutSharingList)))
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        filtered_query_set = (filtered_query_set | self.Model.objects.filter(Q(publiclyShared=True) | Q(id__in=sharedLayouts))).distinct()   # extending filtered query set
        return get_list(request.GET, filtered_query_set, self.ModelSerializer)

class TCLayoutSharingView(CommonView, APIView):
    RelationsToSchool = ['parentLayout__parentSchool__id']
    Model = TCLayoutSharing

    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        filtered_query_set = (filtered_query_set | self.Model.objects.filter(parentSchool=activeSchoolID)).distinct()   # extending filtered query set
        return get_object(request.GET, filtered_query_set, self.ModelSerializer)

class TCLayoutSharingListView(CommonListView, APIView):
    RelationsToSchool = ['parentLayout__parentSchool__id']
    Model = TCLayoutSharing

    @user_permission_3
    def get(self, request, activeSchoolID, activeStudentID):
        filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
        filtered_query_set = (filtered_query_set | self.Model.objects.filter(parentSchool=activeSchoolID)).distinct()   # extending filtered query set
        return get_list(request.GET, filtered_query_set, self.ModelSerializer)

class TCImageAssetsView(CommonView, APIView):
    Model = TCImageAssets

class TCImageAssetsListView(CommonListView, APIView):
    Model = TCImageAssets


class TransferCertificateSettingsView(CommonView, APIView):
    Model = TransferCertificateSettings

class TransferCertificateSettingsListView(CommonListView, APIView):
    Model = TransferCertificateSettings


class TransferCertificateNewView(CommonView, APIView):
    Model = TransferCertificateNew

class TransferCertificateNewListView(CommonListView, APIView):
    Model = TransferCertificateNew