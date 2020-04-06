
from school_app.model.models import School


def update_profile_image(profile_image, school_id):

    school_object = School.objects.get(id=school_id)

    school_object.profileImage.delete()
    school_object.save()

    school_object.profileImage = profile_image
    school_object.save()

    return {
        'status': 'success',
        'message': "Updated profile image successfully",
        'url': school_object.profileImage.url,
    }
