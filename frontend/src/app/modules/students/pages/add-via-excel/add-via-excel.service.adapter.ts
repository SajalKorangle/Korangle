import { AddViaExcelComponent } from './add-via-excel.component';
import { Query } from '@services/generic/query';


export class AddViaExcelServiceAdapter {
    vm: AddViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: AddViaExcelComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData() {

        this.vm.isLoading = true;

        let studentParameterQuery = new Query()
        .filter({
            parentSchool: this.vm.user.activeSchool.dbId,
            parameterType__in: ['TEXT', 'FILTER'],
        })
        .getObjectList({student_app: 'StudentParameter'});

        let sessionQuery = new Query()
        .getObjectList({school_app: 'Session'});

        let studentParameterList, sessionList;
        [
            studentParameterList,
            sessionList,
        ] = await Promise.all([
            studentParameterQuery,
            sessionQuery,
        ]);

        this.vm.softwareColumnHeaderList =
            this.vm.softwareColumnHeaderList.concat(
                studentParameterList.map(item => { 
                    return {
                        name: item.name,
                        possibleExcelHeaderNameList: [],
                    }
                })
            );

        this.vm.uploadSheetAdapter.currentSessionName = sessionList.find(session => {
            return session.id == this.vm.user.activeSchool.currentSessionDbId;
        }).name;

        this.vm.isLoading = false;

    }
    // Ends: initializeData()

}
