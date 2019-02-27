
from student_app.models import Student


def update_profile_image(profile_image, student_id):

    student_object = Student.objects.get(id=student_id)

    # student_object.profileImage.delete()
    # student_object.save()

    student_object.profileImage = profile_image
    student_object.save(profileImageUpdation=True)

    return {
        'status': 'success',
        'message': "Updated profile image successfully",
        'url': student_object.profileImage.url,
    }
