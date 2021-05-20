import { TaskPermissionStructure, PermissionStructure } from '@classes/task-settings';

const pageSettings = new TaskPermissionStructure("tc", "cancel_tc");


pageSettings.permissionStructureMappedByKey['userPermission'] = new PermissionStructure(
    "User Permission",
    "select",
    [["admin", "Admin"], ["teacher", "Teacher"]]);