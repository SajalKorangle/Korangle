
from student_app.models import Student

def partial_update_profile_image(data, Model, ModelSerializer):

    object = Model.objects.get(id=int(data.FILES['id'].read().decode('utf-8')))

    object.profileImage.delete()
    object.save()

    object.profileImage = data.FILES['profileImage']
    object.save()

    return ModelSerializer(object).data

# Depriciated
def update_profile_image(profile_image, student_id):

    student_object = Student.objects.get(id=student_id)

    student_object.profileImage.delete()
    student_object.save()

    student_object.profileImage = profile_image
    student_object.save()

    return {
        'status': 'success',
        'message': "Updated profile image successfully",
        'url': student_object.profileImage.url,
    }
