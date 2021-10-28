# from common.common_views_3 import CommonListView, CommonView, APIView
# from common.common_serializer_interface_3 import get_object, get_list
# from decorators import user_permission_3
# from django.db.models import Q

# from .models import Layout, LayoutShare


# class LayoutView(CommonView, APIView):
#     Model = Layout
#     RelationsToSchool = ['parentSchool__id']

#     @user_permission_3
#     def get(self, request, activeSchoolID, activeStudentID):
#         layoutSharingList = LayoutShare.objects.filter(parentSchool=activeSchoolID)
#         sharedLayouts = list(map(lambda o:o.parentLayout.id, list(layoutSharingList)))
#         filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
#         filtered_query_set = (filtered_query_set | self.Model.objects.filter(Q(publiclyShared=True) | Q(id__in=sharedLayouts))).distinct()  # extending filtered query set
#         return get_object(request.GET, filtered_query_set, self.ModelSerializer)


# class LayoutListView(CommonListView, APIView):
#     Model = Layout
#     RelationsToSchool = ['parentSchool__id']

#     @user_permission_3
#     def get(self, request, activeSchoolID, activeStudentID):
#         layoutSharingList = LayoutShare.objects.filter(parentSchool=activeSchoolID)
#         sharedLayouts = list(map(lambda o:o.parentLayout.id, list(layoutSharingList)))
#         filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
#         filtered_query_set = (filtered_query_set | self.Model.objects.filter(Q(publiclyShared=True) | Q(id__in=sharedLayouts))).distinct()   # extending filtered query set
#         return get_list(request.GET, filtered_query_set, self.ModelSerializer)


# class LayoutSharingView(CommonView, APIView):
#     RelationsToSchool = ['parentLayout__parentSchool__id']
#     Model = LayoutShare

#     @user_permission_3
#     def get(self, request, activeSchoolID, activeStudentID):
#         filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
#         filtered_query_set = (filtered_query_set | self.Model.objects.filter(parentSchool=activeSchoolID)).distinct()   # extending filtered query set
#         return get_object(request.GET, filtered_query_set, self.ModelSerializer)

# class LayoutSharingListView(CommonListView, APIView):
#     RelationsToSchool = ['parentLayout__parentSchool__id']
#     Model = LayoutShare

#     @user_permission_3
#     def get(self, request, activeSchoolID, activeStudentID):
#         filtered_query_set = self.permittedQuerySet(activeSchoolID, activeStudentID)
#         filtered_query_set = (filtered_query_set | self.Model.objects.filter(parentSchool=activeSchoolID)).distinct()   # extending filtered query set
#         return get_list(request.GET, filtered_query_set, self.ModelSerializer)


# from .models import ImageAssets
# class ImageAssetsView(CommonView, APIView):
#     Model = ImageAssets

# class ImageAssetsListView(CommonListView, APIView):
#     Model = ImageAssets
