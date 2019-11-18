
import json
from class_app.models import Class, Division
from school_app.model.models import School


def create_class_teacher_signature_object(data, Model, ModelSerializer):

    print('one')
    signature_data = json.loads(data.body.decode('utf-8'))
    # print(signature_data['signatureImage'])
    # print(data.FILES['signatureImage'].read())

    # form = ContactForm(data.POST)

    print(signature_data['parentSchool'])


    object = Model(parentClass=Class.objects.get(id=signature_data['parentClass']),
                   parentDivision=Division.objects.get(id=signature_data['parentDivision']),
                   parentSchool=School.objects.get(id=signature_data['parentSchool']))
    object.save()

    print('two')
    object.signatureImage = signature_data['signatureImage']
    object.save()

    print('three')
    """serializer = ModelSerializer.serialize('json',object)

    print('four')
    if serializer.is_valid(raise_exception=True):
        return serializer.data
    else:
        return 'Creation failed'"""


def partial_update_class_teacher_signature_object(data, Model, ModelSerializer):

    signature_data = json.loads(data.body.decode('utf-8'))

    object = Model.objects.get(id=signature_data['id'])

    object.signatureImage.delete()
    object.save()

    object.signatureImage = signature_data['signatureImage']
    object.save()

    serializer = ModelSerializer.serialize('json',object)

    if serializer.is_valid(raise_exception=True):
        return serializer.data
    else:
        return 'Partial Updation Failed'

