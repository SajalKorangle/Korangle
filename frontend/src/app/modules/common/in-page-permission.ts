type InputTypeInterface = "number" | "select" | "groupOfCheckBox";
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
export class GroupOfCheckBoxPermission extends InPagePermission {
    checkBoxValues: AllowedValueInterface;

    constructor(displayName: string, inputType: InputTypeInterface, checkBoxValues: AllowedValueInterface, options: Options = {}) {
        super(displayName, inputType, null, options);
        this.checkBoxValues = checkBoxValues;
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

// Employees -> Assign Task
const employeeAssignTask = new TaskPermissionStructure('employees', 'assign_task');

// Online Classes
import '@modules/online-classes/pages/add-account/add-account.permissions';

// Tutorial
import '@modules/tutorials/pages/add-tutorial/add-tutorial.permissions';

// Homework
import '@modules/homework/pages/issue-homework/issue-homework.permissions';

// Examination
import '@modules/examination/pages/update-marks/update-marks.permissions';
import '@modules/examination/pages/add-student-remarks/add-student-remarks.permissions';

// Grade
import '@modules/grade/pages/grade-student/grade-student.permissions';

// Attendance
import '@modules/attendance/pages/record-attendance/record-attendance.permissions';

// Parent Support
import '@modules/complaints/pages/manage-complaints/manage-complaints.permissions';
