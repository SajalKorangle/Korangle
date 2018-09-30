
'''from team_app.models import Member, Permission
from django.contrib.auth.models import User

from .permission import update_permissions


def delete_member(data):

    member_object = Member.objects.get(id=data['dbId'])

    user_object = member_object.parentUser
    school_object = member_object.parentSchool

    Permission.objects.filter(parentUser=user_object, parentSchool=school_object).delete()
    member_object.delete()

    return 'Member removed successfully'


def create_member(data):

    user_object = User.objects.get(id=data['userDbId'])

    member_object = Member(parentUser=user_object, parentSchool_id=data['schoolDbId'])
    member_object.save()

    permission_request_data = {
        'schoolDbId': data['schoolDbId'],
        'userDbId': user_object.id,
        'permissionList': data['permissionList'],
    }

    update_permissions(permission_request_data)

    return 'Member added successfully'


def get_school_member_list(data):

    member_list = []

    for member_object in Member.objects.filter(parentSchool_id=data['schoolDbId'])\
            .order_by('parentUser__username').select_related('parentUser'):

        tempMember = {}
        tempMember['dbId'] = member_object.id
        tempMember['username'] = member_object.parentUser.username
        tempMember['userDbId'] = member_object.parentUser.id

        member_list.append(tempMember)

    return member_list
'''