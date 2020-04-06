
from employee_app.models import Employee


def update_profile_image(profile_image, employee_id):

    employee_object = Employee.objects.get(id=employee_id)

    employee_object.profileImage.delete()
    employee_object.save()

    employee_object.profileImage = profile_image
    employee_object.save()

    return {
        'status': 'success',
        'message': "Updated profile image successfully",
        'url': employee_object.profileImage.url,
    }
