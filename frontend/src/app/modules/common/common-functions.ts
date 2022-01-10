import { SESSION_CONSTANT, Session } from '@services/modules/school/models/session';
import { Query } from '@services/generic/query';

export class CommonFunctions {

    static getActiveSession(): Session {
        const today = new Date();
        return SESSION_CONSTANT.find(session => {
            const startDate = new Date(session.startDate);
            const endDate = new Date(session.endDate);
            return startDate <= today && today <= endDate;
        });
    }

    static getModuleTaskPaths() {
        let routePathList = location.pathname.split('/').slice(1);
        return { modulePath: routePathList[0], taskPath: routePathList[1] };
    }

    static async createRecord(employeeId, moduleName, taskName, moduleList, actionString) {
        let parentEmployee = employeeId;
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
        recordObject["activityDescription"] = actionString;
        const response = await new Query().createObject({activity_record_app: 'ActivityRecord'}, recordObject);
    }
}
