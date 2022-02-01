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
        this.vm.tableFormatTitle = table.formatName;
        let tableRows = [];
        let tableCols = [];

        Object.entries(table["rows"]).forEach(([key, value]) => {
            tableRows.push(value);
        });

        Object.entries(table["cols"]).forEach(([key, value]) => {
            tableCols.push(value);
        });

        this.vm.columnFilters = tableCols;
        this.vm.rowFilters = tableRows;
    }  // Ends: tableOpenClicked()

     /* For mobile-browser */
    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* For mobile-application */
    checkMobile(): boolean {
        return isMobile();
    }
}
