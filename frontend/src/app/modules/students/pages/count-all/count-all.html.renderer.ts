import { CountAllComponent } from './count-all.component';
import { isMobile } from '../../../../classes/common';

export class CountAllHtmlRenderer {

    vm: CountAllComponent;

    constructor() {
    }

    initializeRenderer(vm: CountAllComponent): void {
        this.vm = vm;
    }

    /* Open Existing Table */
    tableOpenClicked(table, idx): void {
        this.vm.isTableEditing = true;
        this.vm.tableActiveId = table["id"];
        this.vm.tableActiveIdx = idx;
        this.vm.tableFormatTitle = table.formatName.toString().trim();
        this.vm.oldTableFormatTitle = table.formatName.toString().trim();
        let tableRows = [];
        let tableCols = [];

        Object.entries(table["rows"]).forEach(([key, value]) => {
            tableRows.push(value);
        });

        Object.entries(table["cols"]).forEach(([key, value]) => {
            tableCols.push(value);
        });


        this.vm.columnFilterList$.next(tableCols);
        this.vm.rowFilterList$.next(tableRows);

    }  // Ends: tableOpenClicked()

    /* Check Table Name Uniqueness */
    checkTableName() {
        let tempUniqueCount = 0;

        for (let idx = 0; idx < this.vm.tableList.length; idx++) {
            if (this.vm.tableList[idx].formatName.toString().trim() == this.vm.tableFormatTitle.toString().trim() && idx != this.vm.tableActiveIdx) {
                tempUniqueCount++;
            }
        }

        if (tempUniqueCount > 0) {
            return false;
        } else {
            return true;
        }
    }  // Ends: checkTableName()

    /* For mobile-browser */
    isMobileBrowser(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* For mobile-application */
    isMobileApplication(): boolean {
        return isMobile();
    }
}
