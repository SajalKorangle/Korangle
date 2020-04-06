
from school_app.model.models import School


def update_principal_signature_image(principal_signature_image, school_id):

    school_object = School.objects.get(id=school_id)

    school_object.principalSignatureImage.delete()
    school_object.save()

    school_object.principalSignatureImage = principal_signature_image
    school_object.save()

    return {
        'status': 'success',
        'message': "Updated prinicpal\'s signature image successfully",
        'url': school_object.principalSignatureImage.url,
    }
