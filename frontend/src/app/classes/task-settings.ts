type InputTypeInterface = "number" | "select";
type AllowedValueInterface = Array<[any, string]>;   // [any: value, string: displayName]

export class PermissionStructure {
    displayName: string;
    inputType: InputTypeInterface;
    allowedValues?: AllowedValueInterface;   // [any: value, string: displayName]

    constructor(displayName: string, inputType: InputTypeInterface, allowedValues: AllowedValueInterface = null) {
        this.displayName = displayName;
        this.inputType = inputType;
        this.allowedValues = allowedValues;
    }

};

export class TaskPermissionStructure {
    modulePath: string;
    taskPath: string;
    permissionStructureMappedByKey: { [key: string]: PermissionStructure; } = {};

    constructor(modulePath: string, taskPath: string) {
        this.modulePath = modulePath;
        this.taskPath = taskPath;
        TASK_PERMISSION_LIST.push(this);
    }
};

export const TASK_PERMISSION_LIST: Array<TaskPermissionStructure> = [];   // All instance of SettingsStructure will be registered here

console.log("TASK_PERMISSION_LIST: ", TASK_PERMISSION_LIST);

import '@modules/tc/pages/cancel-tc/task-settings.model.ts';