import { TaskPermissionStructure, InPagePermission } from '@classes/task-settings';

export const USER_PERMISSION_KEY = 'userType';
export const ADMIN_PERMSSION = 'admin';
export const TEACHER_PERMISSION = 'user';

const add_account_in_page_permission = new TaskPermissionStructure("online_classes", "add_account");

add_account_in_page_permission.inPagePermissionMappedByKey[USER_PERMISSION_KEY]
    = new InPagePermission(
        'User Type',
        'select',
        [[ADMIN_PERMSSION, 'Admin'], [TEACHER_PERMISSION, 'Teacher']],
        { groupName: "User Type Permission" }
    );