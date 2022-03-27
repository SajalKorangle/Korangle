import { TaskPermissionStructure, InPagePermission } from '@modules/common/in-page-permission';

export const USER_PERMISSION_KEY = 'userType';
export const ADMIN_PERMISSION = 'admin';
export const TEACHER_PERMISSION = 'teacher';

const add_account_in_page_permission = new TaskPermissionStructure("complaints", "manage_complaints");

add_account_in_page_permission.inPagePermissionMappedByKey[USER_PERMISSION_KEY]
    = new InPagePermission(
        'User Type',
        'select',
        [[ADMIN_PERMISSION, 'Admin'], [TEACHER_PERMISSION, 'Teacher']],
        { groupName: "User Type Permission" }
    );
