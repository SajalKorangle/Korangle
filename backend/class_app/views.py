from common.common_views_3 import CommonView, CommonListView, APIView
from decorators import user_permission_3
from class_app.models import ClassTeacherSignature



############ ClassTeacherSignature ###########
from .business.class_teacher_signature import create_class_teacher_signature_object, partial_update_class_teacher_signature_object


class ClassTeacherSignatureView(CommonView, APIView):
    Model = ClassTeacherSignature
    RelationsToSchool = ['parentSchool__id']

    @user_permission_3
    def post(self, request, *args, **kwargs):   # Remove this after fixing the frontend request data format; Future iteration
        return create_class_teacher_signature_object(request, self.Model, self.ModelSerializer)

    @user_permission_3
    def patch(self, request, *args, **kwargs):  # Remove this after fixing the frontend request data format; Future iteration
        return partial_update_class_teacher_signature_object(request, self.Model, self.ModelSerializer)


class ClassTeacherSignatureListView(CommonListView, APIView):
    Model = ClassTeacherSignature
    RelationsToSchool = ['parentSchool__id']
