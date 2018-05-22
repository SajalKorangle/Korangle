
# Models
from team_app.models import Permission
from school_app.model.models import School
from django.contrib.auth.models import User


def get_school_member_permission_list(data):

    permission_list = []

    for permission_object in \
            Permission.objects.filter(parentSchool_id=data['schoolDbId'],
                                      parentUser_id=data['userDbId'])\
                    .order_by('parentTask__parentModule__orderNumber', 'parentTask__orderNumber')\
                    .select_related('parentTask'):

        permission = {
            'dbId': permission_object.id,
            'taskDbId': permission_object.parentTask.id,
        }

        permission_list.append(permission)

    return permission_list


def update_permissions(data):

    school_object = School.objects.get(id=data['schoolDbId'])
    user_object = User.objects.get(id=data['userDbId'])

    Permission.objects.filter(parentSchool=school_object,
                              parentUser=user_object).delete()

    for permission in data['permissionList']:

        permission_object = Permission(parentSchool=school_object,
                                       parentUser=user_object,
                                       parentTask_id=permission['taskDbId'])
        permission_object.save()

    return 'Permissions updated successfully'