import { CountAllComponent } from './count-all.component';
import { CommonFunctions } from '@classes/common-functions';

import { Query } from '@services/generic/query';

export class CountAllServiceAdapter {
    vm: CountAllComponent;

    constructor() { }

    initializeAdapter(vm: CountAllComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData(): void {
        this.vm.isLoading = true;

        const complaintTypeQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'ComplaintType' });

        const statusQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ parent_support_app: 'Status' });

        // let complaintTypeList = [];
        let statusList = [];
        [
            this.vm.complaintTypeList,   // 0
            statusList,   // 1
        ] = await Promise.all([
            complaintTypeQuery,   // 0
            statusQuery,   // 1
        ]);

        // this.vm.initializecomplaintTypeList(complaintTypeList);
        this.vm.initializeStatusList(statusList);

        this.vm.isLoading = false;
    }

    /* Update Table List */
    // updateTableList(): void {
    //
    //     this.vm.isLoading = true;
    //
    //     const count_all_table_filter = {
    //         parentSchool: this.vm.user.activeSchool.dbId,
    //     };
    //
    //     Promise.all([
    //         new Query().filter(count_all_table_filter).getObjectList({student_app: 'CountAllTable'}),    // 0
    //     ]).then(
    //         (value) => {
    //             this.vm.tableList = value[0];
    //             this.vm.isLoading = false;
    //         },
    //         (error) => {
    //             this.vm.isLoading = false;
    //         }
    //     );
    // }

    /* Save Table */
    // async saveTable() {
    //     this.vm.isLoading = true;
    //     let tableDataObject = {};
    //     tableDataObject["formatName"] = this.vm.tableFormatTitle;
    //     tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;
    //
    //     /* Get Rows */
    //     let rows = {};
    //     this.vm.rowFilters.forEach((rowFilter, index) => {
    //         let name = "row" + index;
    //         rows[name] = rowFilter;
    //     });
    //     tableDataObject["rows"] = rows;
    //
    //     /* Get Columns */
    //     let cols = {};
    //     this.vm.columnFilters.forEach((colFilter, index) => {
    //         let name = "col" + index;
    //         cols[name] = colFilter;
    //     });
    //     tableDataObject["cols"] = cols;
    //
    //     /* Create An Object */
    //     const response = await new Query().createObject({student_app: 'CountAllTable'}, tableDataObject);
    //     this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableList.length);
    //     this.updateTableList();
    //
    //     this.vm.isLoading = false;
    //     alert("Table saved successfully.");
    // }

    /* Update Table */
    // async updatetable() {
    //     this.vm.isLoading = true;
    //     let tableDataObject = {};
    //     tableDataObject["id"] = this.vm.tableActiveId;
    //     tableDataObject["formatName"] = this.vm.tableFormatTitle;
    //     tableDataObject["parentSchool"] = this.vm.user.activeSchool.dbId;
    //
    //     /* Get Rows */
    //     let rows = {};
    //     this.vm.rowFilters.forEach((rowFilter, index) => {
    //         let name = "row" + index;
    //         rows[name] = rowFilter;
    //     });
    //     tableDataObject["rows"] = rows;
    //
    //     /* Get Columns */
    //     let cols = {};
    //     this.vm.columnFilters.forEach((colFilter, index) => {
    //         let name = "col" + index;
    //         cols[name] = colFilter;
    //     });
    //     tableDataObject["cols"] = cols;
    //
    //     /* Update An Object */
    //     const response = await new Query().updateObject({student_app: 'CountAllTable'}, tableDataObject);
    //     this.vm.htmlRenderer.tableOpenClicked(response, this.vm.tableActiveIdx);
    //     this.updateTableList();
    //
    //     this.vm.isLoading = false;
    //     alert("Table updated successfully.");
    // }

    // async deleteTable() {
    //     this.vm.isLoading = true;
    //
    //     let tableData = {
    //         id: this.vm.tableActiveId,
    //     }
    //     const response = new Query().filter(tableData).deleteObjectList({student_app: 'CountAllTable'});
    //     console.log("response: ", response);
    //
    //     this.vm.tableList.splice(this.vm.tableActiveIdx, 1);
    //     this.vm.initializeTableDetails();
    //     this.vm.isLoading = false;
    // }
}
