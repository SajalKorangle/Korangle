type InputTypeInterface = "number" | "select";
type AllowedValueInterface = Array<[any, string]>;   // [any: value, string: displayName]
export type valueType = number | string;

interface Options {
    groupName?: string;
}

export class InPagePermission {
    displayName: string;
    inputType: InputTypeInterface;
    allowedValues?: AllowedValueInterface;   // [any: value, string: displayName]
    options: Options;

    constructor(displayName: string, inputType: InputTypeInterface, allowedValues: AllowedValueInterface = null, options: Options = {}) {
        this.displayName = displayName;
        this.inputType = inputType;
        this.allowedValues = allowedValues;
        this.options = options;
    }

}

export class TaskPermissionStructure {
    modulePath: string;
    taskPath: string;
    inPagePermissionMappedByKey: { [key: string]: InPagePermission; } = {};

    constructor(modulePath: string, taskPath: string) {
        this.modulePath = modulePath;
        this.taskPath = taskPath;
        TASK_PERMISSION_LIST.push(this);
    }
}

export const TASK_PERMISSION_LIST: Array<TaskPermissionStructure> = [];   // All instance of SettingsStructure will be registered here

// Fees -> Total Collection
const feesTotalCollection = new TaskPermissionStructure('fees', 'total_collection');
feesTotalCollection.inPagePermissionMappedByKey['numberOfDays'] = new InPagePermission('No. of Days', 'number');

// Online Classes
import '@modules/online-classes/pages/add-account/add-account.permissions';

// Tutorial
import '@modules/tutorials/pages/add-tutorial/add-tutorial.permissions';