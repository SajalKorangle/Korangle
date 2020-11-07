import { DesignReportCardComponent } from './design-report-card.component';
import {
    DATA_TYPES,
    FIELDS,
    MARKS_TYPE_LIST,
    marksVariableStructure,
    TEST_TYPE_LIST,
    UserHandleStructure
} from '@modules/report-card/class/constants';

export class DesignReportCardHtmlAdapter {

    vm: DesignReportCardComponent;

    currentTableCell = {
        rowIndex: 0,
        columnIndex: 0,
    };

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
    }

    getExaminationFromExaminationId(examinationId: any): any {
        return this.vm.data.examinationList.find(examination => {
            return examination.id === examinationId;
        });
    }

    getSubjectFromSubjectId(subjectId: any): any {
        return this.vm.data.subjectList.find(subject => {
            return subject.id === subjectId;
        });
    }

    getAbbreviation(str: any): any {
        const split = str.trim().split(' ');
        let abbrev = '';
        split.forEach(word => {
            abbrev += word.charAt(0) + '. ';
        });
        return abbrev;
    }

    addToCurrentUserHandleList(parameter: any): void {
        this.vm.currentLayout.content.push(
            UserHandleStructure.getStructure(
                parameter.key,
                parameter.dataType
            )
        );
        this.vm.currentField = parameter.field;
        this.vm.currentUserHandle = this.vm.currentLayout.content[this.vm.currentLayout.content.length - 1];

        // So the object appears in the middle of the document with sizeable fonts.
        this.vm.currentUserHandle.y = 145;
        this.vm.currentUserHandle.x = 80;
        if (parameter.dataType === DATA_TYPES.TEXT
            || parameter.dataType === DATA_TYPES.MARKS
            || parameter.dataType === DATA_TYPES.DATE) {
            this.vm.currentUserHandle.fontSize = 7;
        }

        if (parameter.field.fieldStructureKey === FIELDS.CONSTANT.fieldStructureKey) {
            this.vm.currentUserHandle.value = 'Text - ' + (this.vm.getFilteredCurrentUserHandleListByGivenField(parameter.field).length);
        }
        if (parameter.key === FIELDS.EXAMINATION.fieldStructureKey + '-' + DATA_TYPES.MARKS) {
            this.vm.currentUserHandle.formula = 'a';
            this.addMarksToMarksVariableList(this.vm.currentUserHandle.marksVariableList);
            this.giveExamMarksUserHandleAName();
        }
        if (parameter.dataType === DATA_TYPES.TABLE) {
            this.currentTableCell = {
                rowIndex: 0,
                columnIndex: 0,
            };
        }
    }

    addMarksToMarksVariableList(marksVariableList: any): void {
        const marksVariableObject = {...marksVariableStructure};
        marksVariableObject.parentExamination = this.vm.data.examinationList[0].id;
        marksVariableObject.parentSubject = this.vm.data.subjectList[0].id;
        marksVariableObject.testType = TEST_TYPE_LIST[0];
        marksVariableObject.marksType = MARKS_TYPE_LIST[0];
        marksVariableList.push(marksVariableObject);
    }

    makeACopy(userHandle: any): void {
        this.vm.currentLayout.content.push(JSON.parse(JSON.stringify(userHandle)));
        this.vm.currentUserHandle = this.vm.currentLayout.content[this.vm.currentLayout.content.length - 1];

        // So the object appears in the middle of the document.
        this.vm.currentUserHandle.y += 4;
        this.vm.currentUserHandle.x += 4;

        const parameter = this.vm.getParameter(userHandle.key);
        if (parameter.field.fieldStructureKey === this.vm.fields.CONSTANT.fieldStructureKey) {
            this.vm.currentUserHandle.value = 'Text - ' + (this.vm.getFilteredCurrentUserHandleListByGivenField(parameter.field).length);
        }
        if (parameter.key === FIELDS.EXAMINATION.fieldStructureKey + '-' + DATA_TYPES.MARKS) {
            this.vm.currentUserHandle.name = '';
            this.giveExamMarksUserHandleAName();
        }
        if (parameter.dataType === DATA_TYPES.TABLE) {
            this.currentTableCell = {
                rowIndex: 0,
                columnIndex: 0,
            };
        }
    }

    giveExamMarksUserHandleAName(): any {
        let i = 1;
        while (true) {
            if (this.getMarksUserHandleListExceptCurrent().find(item => {
                return item.name === 'Marks Formula - ' + i;
            }) === undefined) {
                this.vm.currentUserHandle.name = 'Marks Formula - ' + i;
                break;
            }
            i++;
        }
    }

    getMarksUserHandleListExceptCurrent(): any {
        return this.vm.currentLayout.content.filter(userHandle => {
            return userHandle.key ===  FIELDS.EXAMINATION.fieldStructureKey + '-' + DATA_TYPES.MARKS
                && userHandle.name !== this.vm.currentUserHandle.name;
        });
    }

    addMarksUserHandleToMarksVariableList(): void {
        this.vm.currentUserHandle.marksVariableList.push(this.getMarksUserHandleListExceptCurrent()[0].name);
    }

    getMarksUserHandleListWithName(name: any): boolean {
        return this.vm.currentLayout.content.filter(userHandle => {
            return userHandle.key ===  FIELDS.EXAMINATION.fieldStructureKey + '-' + DATA_TYPES.MARKS
                && userHandle.name === name;
        });
    }

    addTableRowBefore(): void {
        const rowIndex = this.currentTableCell.rowIndex;
        this.vm.currentUserHandle.rowList.splice(rowIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.rowList[rowIndex])));
        this.vm.currentUserHandle.horizontalLineList.splice(rowIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.horizontalLineList[rowIndex])));
        this.vm.currentUserHandle.verticalLineList.forEach(verticalLine => {
            verticalLine.splice(rowIndex, 0, JSON.parse(JSON.stringify(verticalLine[rowIndex])));
        });
    }

    addTableRowAfter(): void {
        const rowIndex = this.currentTableCell.rowIndex;
        this.vm.currentUserHandle.rowList.splice(rowIndex + 1, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.rowList[rowIndex])));
        this.vm.currentUserHandle.horizontalLineList.splice(rowIndex + 2, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.horizontalLineList[rowIndex + 1])));
        this.vm.currentUserHandle.verticalLineList.forEach(verticalLine => {
            verticalLine.splice(rowIndex + 1, 0, JSON.parse(JSON.stringify(verticalLine[rowIndex])));
        });
    }

    deleteTableRow(): void {
        const rowIndex = this.currentTableCell.rowIndex;
        this.vm.currentUserHandle.rowList.splice(rowIndex, 1);
        this.vm.currentUserHandle.horizontalLineList.splice(rowIndex + 1, 1);
        this.vm.currentUserHandle.verticalLineList.forEach(verticalLine => {
            verticalLine.splice(rowIndex, 1);
        });
    }

    addTableColumnBefore(): void {
        const columnIndex = this.currentTableCell.columnIndex;
        this.vm.currentUserHandle.columnList.splice(columnIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.columnList[columnIndex])));
        this.vm.currentUserHandle.verticalLineList.splice(columnIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.verticalLineList[columnIndex])));
        this.vm.currentUserHandle.horizontalLineList.forEach(horizontalLine => {
            horizontalLine.splice(columnIndex, 0, JSON.parse(JSON.stringify(horizontalLine[columnIndex])));
        });
    }

    addTableColumnAfter(): void {
        const columnIndex = this.currentTableCell.columnIndex;
        this.vm.currentUserHandle.columnList.splice(columnIndex + 1, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.columnList[columnIndex])));
        this.vm.currentUserHandle.verticalLineList.splice(columnIndex + 2, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.verticalLineList[columnIndex + 1])));
        this.vm.currentUserHandle.horizontalLineList.forEach(horizontalLine => {
            horizontalLine.splice(columnIndex + 1, 0, JSON.parse(JSON.stringify(horizontalLine[columnIndex])));
        });
    }

    deleteTableColumn(): void {
        const columnIndex = this.currentTableCell.columnIndex;
        this.vm.currentUserHandle.columnList.splice(columnIndex, 1);
        this.vm.currentUserHandle.verticalLineList.splice(columnIndex + 1, 1);
        this.vm.currentUserHandle.horizontalLineList.forEach(horizontalLine => {
            horizontalLine.splice(columnIndex, 1);
        });
    }

    /* Hide the data below till it's not valid, when onBlur is called change to any valid name
    isValidExaminationParameterName(): boolean {
        this.vm.currentUserHandle.
    }*/

    testConsole(): void {
        console.log('okay');
    }


}

