import { SESSION_CONSTANT, Session } from '@services/modules/school/models/session';

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

}
