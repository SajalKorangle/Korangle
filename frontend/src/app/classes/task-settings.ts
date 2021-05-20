type InputTypeInterface = "string" | "number" | "date" | "select";
type AllowedValueInterface = Array<[any, string]>;   // [any: value, string: displayName]

interface Options { // additional configuration for inputType, like multi selection for select 
    required?: boolean; // default false
    multi?: boolean;    // default false
    orderNumbe?: number;
}

export class Structure {
    displayName: string;
    inputType: InputTypeInterface;
    allowedValues?: AllowedValueInterface;   // [any: value, string: displayName]
    options?: Options; // additional configuration for inputType, like multi selection for select 

    constructor(displayName: string, inputType: InputTypeInterface, allowedValues: AllowedValueInterface = null, options: Options = {}) {
        this.displayName = displayName;
        this.inputType = inputType;
        this.allowedValues = allowedValues;
        this.options = options;
    }

};

export class SettingStructure {
    modulePath: string;
    taskPath: string;
    structure: { [key: string]: Structure; };

    constructor(modulePath: string, taskPath: string) {
        this.modulePath = modulePath;
        this.taskPath = taskPath;
        TASK_SETTINGS_LIST.push(this);
    }
};

export const TASK_SETTINGS_LIST: Array<SettingStructure> = [];   // All instance of SettingsStructure will be registered here

console.log(TASK_SETTINGS_LIST);