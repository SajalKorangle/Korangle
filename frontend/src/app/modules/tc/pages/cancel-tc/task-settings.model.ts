import { SettingStructure, Structure } from '@classes/task-settings';

const pageSettings = new SettingStructure("tc", "cancel_tc");
pageSettings.structure['userPermission'] = new Structure("User Permission", "string");