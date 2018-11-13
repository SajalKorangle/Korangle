
from attendance_app.models import AttendancePermission

from rest_framework import serializers


class AttendancePermissionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendancePermission
        fields = '__all__'


def get_attendance_permission_list(data):

    attendance_permission_list = []

    for attendance_permission_object in \
            AttendancePermission.objects.filter(parentEmployee_id=data['parentEmployee'],
                                                parentSession_id=data['sessionId']) \
                    .order_by('parentClass__orderNumber','parentDivision__orderNumber'):
        attendance_permission_list.append(AttendancePermissionModelSerializer(attendance_permission_object).data)

    return attendance_permission_list


def create_attendance_permission(data):

    attendance_permission_serializer = AttendancePermissionModelSerializer(data=data)
    if attendance_permission_serializer.is_valid():
        attendance_permission_serializer.save()
        result = {
            'status': 'success',
            'message': 'Permission given successfully',
            'data': attendance_permission_serializer.data,
        }
    else:
        result = {
            'status': 'failure',
            'message': 'Operation Failed',
        }
    return result


def delete_attendance_permission(data):

    AttendancePermission.objects.get(id=data['id']).delete()

    return 'Permission revoked successfully'
