import { TaskPermissionStructure, InPagePermission, GroupOfCheckBoxPermission } from '@modules/common/in-page-permission';

export const USER_PERMISSION_KEY = 'userType';
export const ADMIN_PERMSSION = 'admin';
export const TEACHER_PERMISSION = 'teacher';

export const VIEW_PERMISSIONS_KEY = 'viewPermissions';
export const VIEW_SUMMARY_PERMISSION = 'viewSummary';

const view_defaulter_in_page_permission = new TaskPermissionStructure("fees", "view_defaulters");

view_defaulter_in_page_permission.inPagePermissionMappedByKey[USER_PERMISSION_KEY]
    = new InPagePermission(
        'User Type',
        'select',
        [[ADMIN_PERMSSION, 'Admin'], [TEACHER_PERMISSION, 'Teacher']],
        { groupName: "User Type Permission" }
    );
    
view_defaulter_in_page_permission.inPagePermissionMappedByKey[VIEW_PERMISSIONS_KEY]
    = new GroupOfCheckBoxPermission(
        '',
        'groupOfCheckBox',
        [[VIEW_SUMMARY_PERMISSION, 'Summary']],
        { groupName: "View Permissions" }
    );
    