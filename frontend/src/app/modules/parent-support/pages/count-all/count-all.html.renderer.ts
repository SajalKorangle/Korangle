import { CountAllComponent } from './count-all.component';

export class CountAllHtmlRenderer {

    vm: CountAllComponent;

    constructor() {
    }

    initializeRenderer(vm: CountAllComponent): void {
        this.vm = vm;
    }

    /* Open Existing Table */
    tableOpenClicked(table): void {
        this.vm.isTableEditing = true;
        this.vm.tableActiveId = table["id"];
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

    isMobile(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }
}
