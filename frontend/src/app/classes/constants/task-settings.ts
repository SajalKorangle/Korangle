type InputTypeInterface = "string" | "number" | "date" | "select";
type AllowedValueInterface = Array<[any, string]>;   // [any: value, string: displayName]

interface Options { // additional configuration for inputType, like multi selection for select 
    required?: boolean; // default false
    multi?: boolean;    // default false
}

export class Structure {
    displayName: string;
    inputType: InputTypeInterface;
    allowedValues?: AllowedValueInterface;   // [any: value, string: displayName]
    options?: Options // additional configuration for inputType, like multi selection for select 

    constructor(displayName: string, inputType: InputTypeInterface, allowedValues: AllowedValueInterface = null, options: Options = {}) {
        this.displayName = displayName;
        this.inputType = inputType;
        this.allowedValues = allowedValues;
        this.options = options;
    }

};

export class SettingStructure {
    moduleName: string;
    taskName: string;
    structure: { [key: string]: Structure };

    constructor(moduleName: string, taskName: string) {
        this.moduleName = moduleName;
        this.taskName = taskName;
    }
};

export const TASK_SETTINGS_LIST = [

]
