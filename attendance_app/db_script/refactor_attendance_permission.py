
def refactor_attendance_permission(apps, schema_editor):

    AttendancePermission = apps.get_model('attendance_app', 'AttendancePermission')
    Division = apps.get_model('class_app', 'Division')

    for attendance_permission_object in AttendancePermission.objects.all():
        attendance_permission_object.parentClass = \
            attendance_permission_object.parentSection.parentClassSession.parentClass
        attendance_permission_object.parentSession = \
            attendance_permission_object.parentSection.parentClassSession.parentSession
        attendance_permission_object.parentDivision = \
            Division.objects.get(name=attendance_permission_object.parentSection.name)
        attendance_permission_object.save()

