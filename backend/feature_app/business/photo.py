
from feature_app.models import Feature


def partial_update_photo(data, Model, ModelSerializer):

    object = Model.objects.get(id=int(data.FILES['id'].read().decode('utf-8')))

    object.photo.delete()
    object.save()

    object.photo = data.FILES['photo']
    object.save()

    return ModelSerializer(object).data

