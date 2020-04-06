
import json
from class_app.models import Class, Division
from school_app.model.models import School
import base64
from django.http import JsonResponse


def create_class_teacher_signature_object(data, Model, ModelSerializer):

    object = Model(parentClass_id=int(data.FILES['parentClass'].read().decode('utf-8')),
                   parentDivision_id=int(data.FILES['parentDivision'].read().decode('utf-8')),
                   parentSchool_id=int(data.FILES['parentSchool'].read().decode('utf-8')))
    object.save()

    object.signatureImage = data.FILES['signatureImage']
    object.save()

    return ModelSerializer(object).data


def partial_update_class_teacher_signature_object(data, Model, ModelSerializer):

    object = Model.objects.get(id=int(data.FILES['id'].read().decode('utf-8')))

    object.signatureImage.delete()
    object.save()

    object.signatureImage = data.FILES['signatureImage']
    object.save()

    return ModelSerializer(object).data

