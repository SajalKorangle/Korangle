import { TaskPermissionStructure, InPagePermission } from '@classes/task-settings';

const pageSettings = new TaskPermissionStructure("tc", "cancel_tc");

export const KEY = "userPermission";
export const KEY2 = "userPermission2";
export const KEY3 = "userPermission3";

pageSettings.inPagePermissionMappedByKey[KEY] = new InPagePermission(
    "User Permission",
    "select",
    [["admin", "Admin"], ["teacher", "Teacher"]],
    { groupName: "User Type" });

pageSettings.inPagePermissionMappedByKey[KEY + '123'] = new InPagePermission(
    "User Permission2",
    "select",
    [["admin", "Admin"], ["teacher", "Teacher"]],
    { groupName: "User Type" });

pageSettings.inPagePermissionMappedByKey[KEY2] = new InPagePermission(
    "User Permission",
    "select",
    [["admin", "Admin"], ["teacher", "Teacher"]],
    { groupName: "Admin Type" });

pageSettings.inPagePermissionMappedByKey[KEY3] = new InPagePermission(
    "User Permission",
    "select",
    [["admin", "Admin"], ["teacher", "Teacher"]]);