import { CountAllComponent } from './count-all.component';
import { CommonFunctions } from '@classes/common-functions';

import { Query } from '@services/generic/query';

export class CountAllServiceAdapter {
    vm: CountAllComponent;

    constructor() { }

    /* Initialize Adapter */
    initializeAdapter(vm: CountAllComponent): void {
        this.vm = vm;
    }  // Ends: initializeAdapter()

    /* Initialize Data */
    async initializeData() {
        this.vm.isLoading = true;

        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintType' });

        const complaintQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'Complaint' });

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'SchoolComplaintStatus' });

        const countAllTableQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'CountAllParentSupport' });


        let complaintTypeList = [];
        let statusList = [];
        let complaintList = [];
        [
            complaintTypeList,   // 0
            statusList,   // 1
            complaintList,   // 2
            this.vm.tableList,   // 3
        ] = await Promise.all([
            complaintTypeQuery,   // 0
            statusQuery,   // 1
            complaintQuery,   // 2
            countAllTableQuery,   // 3
        ]);

        this.vm.initializecomplaintTypeList(complaintTypeList);
        this.vm.initializeStatusList(statusList);
        this.vm.complaintList = complaintList;
        console.log("Complaint List: ", this.vm.complaintList);
        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Save Table */
    async saveTable() {
        this.vm.isLoading = true;
        let tableDataObject = {};
        tableDataObject["formatName"] = this.vm.tableFormatTitle;
        tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        /* Get Rows */
        let rows = {};
        this.vm.rowFilters.forEach((rowFilter, index) => {
            let name = "row" + index;
            rows[name] = rowFilter;
        });
        tableDataObject["rows"] = rows;

        /* Get Columns */
        let cols = {};
        this.vm.columnFilters.forEach((colFilter, index) => {
            let name = "col" + index;
            cols[name] = colFilter;
        });
        tableDataObject["cols"] = cols;

        /* Create An Object */
        const response = await new Query().createObject({parent_support_app: 'CountAllParentSupport'}, tableDataObject);
        this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableList.length);
        this.vm.tableList.push(response);

        this.vm.isTableUpdated = false;
        this.vm.isLoading = false;
        alert("Table saved successfully.");
    }  // Ends: saveTable()

    /* Update Table */
    async updatetable(operation = "") {
        this.vm.isLoading = true;
        let tableDataObject = {};
        tableDataObject["id"] = this.vm.tableActiveId;
        tableDataObject["formatName"] = this.vm.tableFormatTitle;
        tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        /* Get Rows */
        let rows = {};
        this.vm.rowFilters.forEach((rowFilter, index) => {
            let name = "row" + index;
            rows[name] = rowFilter;
        });
        tableDataObject["rows"] = rows;

        /* Get Columns */
        let cols = {};
        this.vm.columnFilters.forEach((colFilter, index) => {
            let name = "col" + index;
            cols[name] = colFilter;
        });
        tableDataObject["cols"] = cols;

        /* Update An Object */
        const response = await new Query().updateObject({parent_support_app: 'CountAllParentSupport'}, tableDataObject);
        this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableActiveIdx);
        this.vm.tableList[this.vm.tableActiveIdx] = response;

        if(operation == "createNew") {
            this.vm.initializeTableDetails();
        }

        this.vm.isLoading = false;
        alert("Table updated successfully.");
    }  // Ends: updatetable()

    /* Delete Table */
    async deleteTable() {
        this.vm.isLoading = true;

        let tableData = {
            id: this.vm.tableActiveId,
        };
        new Query().filter(tableData).deleteObjectList({parent_support_app: 'CountAllParentSupport'});

        this.vm.tableList.splice(this.vm.tableActiveIdx, 1);
        this.vm.initializeTableDetails();
        this.vm.isLoading = false;
    }  // Ends: deleteTable()
}
