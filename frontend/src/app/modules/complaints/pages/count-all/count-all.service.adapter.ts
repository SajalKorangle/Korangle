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
            .getObjectList({ complaints_app: 'SchoolComplaintType' });

        const complaintQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'Complaint' });

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'SchoolComplaintStatus' });

        const countAllTableQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ complaints_app: 'CountAllComplaints' });


        let complaintTypeList = [];
        let statusList = [];
        let complaintList = [];
        let tableList = [];
        [
            complaintTypeList,   // 0
            statusList,   // 1
            complaintList,   // 2
            tableList,   // 3
        ] = await Promise.all([
            complaintTypeQuery,   // 0
            statusQuery,   // 1
            complaintQuery,   // 2
            countAllTableQuery,   // 3
        ]);

        this.vm.initializecomplaintTypeList(complaintTypeList);
        this.vm.initializeStatusList(statusList);
        this.vm.complaintList = complaintList;

        /* Initialize Table List */
        tableList.sort((a, b) => a.id - b.id);
        this.vm.tableList = tableList;

        this.vm.isLoading = false;
    }  // Ends: initializeData()

    /* Update Table List */
    async updateTableList() {
        await new Query().updateObjectList({complaints_app: 'CountAllComplaints'}, this.vm.tableList);
    }  // Ends: updateTableList()

    /* Save Table */
    async saveTable(operation = "", table = null, idx = null) {
        this.vm.isLoading = true;

        let tableDataObject = {};
        tableDataObject["formatName"] = this.vm.tableFormatTitle.toString().trim();
        tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        /* Get Rows */
        let rows = {};
        this.vm.rowFilterList.forEach((rowFilter, index) => {
            let name = "row" + index;
            rows[name] = rowFilter;
        });
        tableDataObject["rows"] = rows;

        /* Get Columns */
        let cols = {};
        this.vm.columnFilterList.forEach((colFilter, index) => {
            let name = "col" + index;
            cols[name] = colFilter;
        });
        tableDataObject["cols"] = cols;

        /* Create An Object */
        const response = await new Query().createObject({complaints_app: 'CountAllComplaints'}, tableDataObject);
        this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableList.length);
        this.vm.tableList.push(response);

        if (operation == "initializeTableDetails") {
            this.vm.initializeTableDetails();
        }
        if (operation == "openTable") {
            this.vm.htmlRenderer.tableOpenClicked(table, idx);
        }

        this.vm.isTableUpdated = false;
        this.vm.isLoading = false;
        alert("Table saved successfully.");
    }  // Ends: saveTable()

    /* Update Table */
    async updatetable(operation = "", table = null, idx = null) {
        this.vm.isLoading = true;

        let tableDataObject = {};
        tableDataObject["id"] = this.vm.tableActiveId;

        if (this.vm.tableFormatTitle.toString().trim()) {
            tableDataObject["formatName"] = this.vm.tableFormatTitle.toString().trim();
        } else if (this.vm.oldTableFormatTitle.toString().trim()) {
            tableDataObject["formatName"] = this.vm.oldTableFormatTitle.toString().trim();
        }
        tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;

        /* Get Rows */
        let rows = {};
        this.vm.rowFilterList.forEach((rowFilter, index) => {
            let name = "row" + index;
            rows[name] = rowFilter;
        });
        tableDataObject["rows"] = rows;

        /* Get Columns */
        let cols = {};
        this.vm.columnFilterList.forEach((colFilter, index) => {
            let name = "col" + index;
            cols[name] = colFilter;
        });
        tableDataObject["cols"] = cols;

        /* Update An Object */
        const response = await new Query().updateObject({complaints_app: 'CountAllComplaints'}, tableDataObject);
        this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableActiveIdx);
        this.vm.tableList[this.vm.tableActiveIdx] = response;

        if (operation == "createNew") {
            this.vm.initializeTableDetails();
        }
        if (table) {
            this.vm.htmlRenderer.tableOpenClicked(table, idx);
        }

        this.vm.isTableUpdated = false;
        this.vm.isLoading = false;
        alert("Table updated successfully.");
    }  // Ends: updatetable()

    /* Delete Table */
    async deleteTable() {
        this.vm.isLoading = true;

        let tableData = {
            id: this.vm.tableActiveId,
        };

        new Query().filter(tableData).deleteObjectList({complaints_app: 'CountAllComplaints'});

        this.vm.tableList.splice(this.vm.tableActiveIdx, 1);
        this.vm.initializeTableDetails();
        this.vm.isLoading = false;
    }  // Ends: deleteTable()

    /* Restore Old Table */
    async restoreOldtable(tableActiveId, tableActiveIdx, table = null, idx = null) {
        Promise.all([
            new Query().filter({id: tableActiveId}).getObject({complaints_app: 'CountAllComplaints'}),   // 0
        ]).then(
            (value) => {
                this.vm.tableList[tableActiveIdx] = value[0];
                if (table) {
                    this.vm.htmlRenderer.tableOpenClicked(table, idx);
                } else {
                    this.vm.initializeTableDetails();
                }
            }
        );
    }  // Ends: restoreOldtable()
}
