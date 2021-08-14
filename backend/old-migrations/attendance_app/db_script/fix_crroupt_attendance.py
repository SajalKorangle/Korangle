def delete_crroupt_attendance_app(apps, schema_editor):
    StudentAttendance = apps.get_model("attendance_app", "StudentAttendance")
    crroupt_attendance = StudentAttendance.objects.get(id=1565699)
    crroupt_attendance.delete()