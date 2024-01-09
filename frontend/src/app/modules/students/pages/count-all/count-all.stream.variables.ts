import { combineLatest } from "rxjs";
import { CountAllComponent } from "./count-all.component";

export class CountAllStreamVariables {

    vm: CountAllComponent;

    table: any;

    rowCountList: any;
    columnCountList: any;

    constructor() { }

    initialize(vm: CountAllComponent) {
        this.vm = vm;
    }

    intializeData() {

        // starts populate rowCountList
        this.vm.rowFilterList$.asObservable().subscribe(rowFilterList => {

            this.rowCountList = [];
            rowFilterList.forEach(rowFilter => {

                let count = 0;
                this.vm.studentFullProfileList.forEach((student) => {
                    let check = this.vm.checkFilters(student, rowFilter);
                    if (check) {
                        count++;
                    }
                });

                this.rowCountList.push(count);

            });
        });
        // ends populate rowCountList

        // starts populate columnCountList
        this.vm.columnFilterList$.asObservable().subscribe(columnFilterList => {

            this.columnCountList = [];
            columnFilterList.forEach(columnFilter => {

                let count = 0;
                this.vm.studentFullProfileList.forEach((student) => {
                    let check = this.vm.checkFilters(student, columnFilter);
                    if (check) {
                        count++;
                    }
                });

                this.columnCountList.push(count);

            });
        });
        // ends populate columnCountList

        // starts populate table data
        combineLatest([
            this.vm.rowFilterList$.asObservable(),
            this.vm.columnFilterList$.asObservable()
        ]).subscribe(([rowFilterList, columnFilterList]) => {

            this.table = [];
            rowFilterList.forEach((rowFilter, rowIndex) => {
                this.table.push([]);
                columnFilterList.forEach((columnFilter, columnIndex) => {

                    let count = 0;
                    this.vm.studentFullProfileList.forEach((student) => {
                        let check = this.vm.checkFilters(student, rowFilter);
                        if (check) {
                            check = this.vm.checkFilters(student, columnFilter);
                            if (check) {
                                count++;
                            }
                        }
                    });

                    this.table[rowIndex].push([]);
                    this.table[rowIndex][columnIndex] = count;

                });
            });

        });
        // ends populate table data

    }

}