

def create_object(data, Model, ModelSerializer):

    object = Model(parentFeature=int(data.FILES['parentFeature'].read().decode('utf-8')))
    object.save()

    object.photo = data.FILES['photo']
    object.save()

    return ModelSerializer(object).data

