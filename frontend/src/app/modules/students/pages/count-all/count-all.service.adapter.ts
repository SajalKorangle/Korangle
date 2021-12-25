import { CountAllComponent } from './count-all.component';
import { CommonFunctions } from '@classes/common-functions';

export class CountAllServiceAdapter {
    vm: CountAllComponent;

    constructor() { }

    initializeAdapter(vm: CountAllComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isLoading = true;
        const student_full_profile_request_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const class_section_request_data = {
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_parameter_value_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };

        const bus_stop_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const tc_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            status__in: ['Generated', 'Issued'],
            fields__korangle: ['parentStudent'],
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),    // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}),  // 1
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),   // 2
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, student_parameter_data), // 3
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, student_parameter_value_data), // 4
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, tc_data),   // 5
            this.vm.genericService.getObjectList({student_app: 'CountAllTable'}, {filter: {parentSchool: this.vm.user.activeSchool.dbId}}),  // 6
        ]).then(
            (value) => {
                value[0].forEach((classs) => {
                    classs.sectionList = [];
                    value[1].forEach((section) => {
                        classs.sectionList.push(CommonFunctions.getInstance().copyObject(section));
                    });
                });
                this.vm.initializeClassSectionList(value[0]);
                this.vm.backendData.tcList = value[5];
                this.vm.initializeStudentFullProfileList(value[2]);
                this.vm.studentParameterList = value[3].map((x) => ({
                    ...x,
                    filterValues: JSON.parse(x.filterValues).map((x2) => ({ name: x2, show: false })),
                    showNone: false,
                    filterFilterValues: '',
                }));
                this.vm.studentParameterValueList = value[4];
                this.vm.tableList = value[6];
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    updateTableList() {
        Promise.all([
            this.vm.genericService.getObjectList({student_app: 'CountAllTable'}, {filter: {parentSchool: this.vm.user.activeSchool.dbId}}),  // 8
        ]).then(
            (value) => {
                this.vm.tableList = value[0];
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    async saveTable() {
        let tableFilter_list = [];
        let tableDataObject = {};
        tableDataObject["formatName"] = this.vm.tableFormatTitle;
        tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        let rows = {};
        this.vm.rowFilters.forEach((rowFilter, index) => {
            let name = "row" + index;
            rows[name] = rowFilter;
        });
        tableDataObject["rows"] = rows;

        let cols = {};
        this.vm.columnFilters.forEach((colFilter, index) => {
            let name = "col" + index;
            cols[name] = colFilter;
        });
        tableDataObject["cols"] = cols;

        tableFilter_list.push(tableDataObject);
        const response = await this.vm.genericService.createObjectList({student_app: 'CountAllTable'}, tableFilter_list);
        this.vm.tableOpenClicked(response[0]);
        this.updateTableList();
    }

    async updatetable() {
        let tableDataObject = {};
        tableDataObject["id"] = this.vm.tableActiveId;
        tableDataObject["formatName"] = this.vm.tableFormatTitle;
        tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;
        
        let rows = {};
        this.vm.rowFilters.forEach((rowFilter, index) => {
            let name = "row" + index;
            rows[name] = rowFilter;
        });
        tableDataObject["rows"] = rows;
        
        let cols = {};
        this.vm.columnFilters.forEach((colFilter, index) => {
            let name = "col" + index;
            cols[name] = colFilter;
        });
        tableDataObject["cols"] = cols;

        const response = await this.vm.genericService.updateObject({student_app: 'CountAllTable'}, tableDataObject);
        this.vm.tableOpenClicked(response);
        this.updateTableList();
    }
}
