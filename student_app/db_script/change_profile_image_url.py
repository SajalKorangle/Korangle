

def change_profile_image_url(apps, schema_editor):

    Student = apps.get_model('student_app', 'Student')

    for student_object in Student.objects.all():
        if student_object.profileImage:
            imagePath = student_object.profileImage.url
            newPath = imagePath
            if imagePath[-4:] == "main":
                newPath = imagePath[37:-4] + "main_thumb"
            elif imagePath[-8:-4] == "main":
                newPath = imagePath[37:-4] + "_thumb" + imagePath[-4:]
            if newPath != imagePath:
                student_object.profileImage = newPath
                student_object.save()
