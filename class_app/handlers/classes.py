
from class_app.models import Class


def get_class_list():

    class_list = []

    for class_object in Class.objects.all().order_by('orderNumber'):

        temp_class_response = {}
        temp_class_response['name'] = class_object.name
        temp_class_response['dbId'] = class_object.id
        temp_class_response['orderNumber'] = class_object.orderNumber

        class_list.append(temp_class_response)

    return class_list