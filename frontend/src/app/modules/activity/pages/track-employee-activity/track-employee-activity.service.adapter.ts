import { TrackEmployeeActivityComponent } from './track-employee-activity.component';
import { Query } from '@services/generic/query';

export class TrackEmployeeActivityServiceAdapter {
    vm: TrackEmployeeActivityComponent;

    constructor() {}

    initializeAdapter(vm: TrackEmployeeActivityComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData() {

        this.vm.isLoading = true;

        const employeeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .annotate('record_count', 'activityRecordList', 'Count')
            .setFields('__all__', 'record_count')
            .getObjectList({ employee_app: 'Employee' });


        let employeeList = [];
        [
            employeeList,   // 0
        ] = await Promise.all([
            employeeQuery,   // 0
        ]);

        this.vm.initializeEmployeeList(employeeList);
        this.vm.initializeTotalRecords(employeeList);
        this.vm.initializeTaskList();

        const recordQuery = new Query()
            .filter({ parentEmployee__parentSchool: this.vm.user.activeSchool.dbId })
            .paginate(Math.max(0, this.vm.startNumber - 1), this.vm.endNumber)
            .getObjectList({ activity_record_app: 'ActivityRecord' });

        [
            this.vm.activityRecordList,   // 0
        ] = await Promise.all([
                recordQuery,   // 0
        ]);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Get Records Based on Applied Filters. */
    async getRecordsFromFilters() {

        this.vm.activityRecordList = [];
        this.vm.isLoading = true;

        let filter = {
            parentEmployee__parentSchool: this.vm.user.activeSchool.dbId,
        }
        let filter2 = {};

        let taskIdList = [];
        this.vm.taskList.forEach((task) => {
            if (task.selected) {
                taskIdList.push(task.taskDbId);
            }
        });
        if (taskIdList.length) {
            filter["parentTask__in"] = taskIdList;
            filter2["activityRecordList__parentTask__in"] = taskIdList;
        }

        let employeeIdList = [];
        this.vm.employeeList.forEach((employee) => {
            if (employee.selected) {
                employeeIdList.push(employee.dbId);
            }
        });
        if (employeeIdList.length) {
            filter["parentEmployee__in"] = employeeIdList;
            filter2["activityRecordList__parentEmployee__in"] = employeeIdList;
        }

        if (this.vm.timeSpanData["dateFormat"] != "- None") {
            let [startDate, to, endDate] = this.vm.timeSpanData["dateFormat"].split(" ");

            let [sDate, sMonth, sYear] = startDate.split("-");
            startDate = sYear + "-" + sMonth + "-" + sDate;

            let [eDate, eMonth, eYear] = endDate.split("-");
            [eMonth, eDate, eYear] = new Date(parseInt(eYear), parseInt(eMonth) - 1, parseInt(eDate) + 1).toLocaleDateString("en-US").split("/");
            endDate = eYear + "-" + eMonth + "-" + eDate;

            filter["createdAt__range"] = [startDate, endDate];
            filter2["activityRecordList__createdAt__range"] = [startDate, endDate];
        }

        if (this.vm.seachString) {
            filter["activityDescription__icontains"] = this.vm.seachString;
            filter2["activityRecordList__activityDescription__icontains"] = this.vm.seachString;
        }

        let orderBy = "createdAt";
        if (this.vm.sortType == "Newest First") {
            orderBy = "-createdAt";
        }

        const employeeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .annotate('record_count', 'activityRecordList', 'Count', filter2)
            .setFields('record_count')
            .getObjectList({ employee_app: 'Employee' });


        let employeeList = [];
        [
            employeeList,   //0
        ] = await Promise.all([
            employeeQuery,   // 0
        ]);

        this.vm.initializeTotalRecords(employeeList);
        this.vm.endNumber = Math.min(10 * this.vm.currentPage, this.vm.totalRecords);
        this.vm.startNumber = Math.min(10 * (this.vm.currentPage - 1) + 1, this.vm.endNumber);

        const recordQuery = new Query()
            .filter(filter)
            .orderBy(orderBy)
            .paginate(Math.max(0, this.vm.startNumber - 1), this.vm.endNumber)
            .getObjectList({ activity_record_app: 'ActivityRecord' });

        [
            this.vm.activityRecordList,   // 0
        ] = await Promise.all([
            recordQuery,  // 0
        ]);

        this.vm.isLoading = false;
    }  // Ends: getRecordsFromFilters()
}
