import { BehaviorSubject, combineLatest, from, Observable } from "rxjs";
import { ViewAllComponent } from "./view-all.component";
import { map } from "rxjs/operators";

export class ViewAllStreamVariables {

    vm: ViewAllComponent;

    enquiryList$ = new BehaviorSubject<any>(null);

    selectedEmployee$ = new BehaviorSubject<any>(null);

    selectedClass$ = new BehaviorSubject<any>(null);

    initialize(vm: ViewAllComponent) {

        // initialize main component instance
        this.vm = vm;

        // initialize data

        // starts populate selected employee
        this.enquiryList$.asObservable().subscribe(() => {
            this.selectedEmployee$.next(null);
        });
        // ends populate selected employee

        // starts populate selected class
        this.enquiryList$.asObservable().subscribe(() => {
            this.selectedClass$.next(null);
        });
        // ends populate selected class

        // starts populate filtered enquiry list
        combineLatest([
            this.enquiryList$.asObservable(),
            this.selectedClass$.asObservable(),
            this.selectedEmployee$.asObservable()
        ]).pipe(
            map(valueList => {
                console.log(valueList);
                let tempList = valueList[0];
                if (valueList[2]) {
                    tempList = tempList.filter((enqList) => {
                        return enqList.parentEmployee == valueList[2].id;
                    });
                }

                if (valueList[1]) {
                    tempList = tempList.filter((enqList) => {
                        return enqList.parentClass == valueList[1].id;
                    });
                }
                this.vm.filteredEnquiryList = tempList;
            })
        ).subscribe();
        // ends populate filtered enquiry list

    }

}