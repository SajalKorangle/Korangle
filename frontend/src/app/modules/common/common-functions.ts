import { Query } from '@services/generic/query';

export class CommonFunctions {

    static isSessionActive(sessionId, sessionList): boolean {
        const today = new Date();
        return sessionList.find(session => {
            const startDate = new Date(session.startDate);
            const endDate = new Date(session.endDate);
            return sessionId == session.id && startDate <= today && today <= endDate;
        });
    }

    static getModuleTaskPaths() {
        let routePathList = location.pathname.split('/').slice(1);
        return { modulePath: routePathList[1], taskPath: routePathList[2] };
    }

    static async createRecord(employeeId, moduleName, taskName, moduleList, actionString) {
        let parentEmployee = employeeId;
        let employee = await new Query().filter({id: parentEmployee}).getObject({ employee_app: 'Employee'});

        let parentTask;
        moduleList.forEach((module) => {
            if (moduleName === module.title) {
                let tempTaskList = module.taskList;
                tempTaskList.forEach((task) => {
                    if (taskName === task.title) {
                        parentTask = task.dbId;
                    }
                });
            }
        });

        let recordObject = {};
        recordObject["parentTask"] = parentTask;
        recordObject["parentEmployee"] = parentEmployee;
        recordObject["activityDescription"] = employee.name + actionString;
        const response = await new Query().createObject({activity_record_app: 'ActivityRecord'}, recordObject);
    }
}
