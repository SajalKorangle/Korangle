import { DesignReportCardComponent } from './design-report-card.component';
import {
    DATA_TYPES,EXAMINATION_TYPE_LIST,
    FIELDS,
    MARKS_TYPE_LIST,marksToGradeRuleStructure,
    marksVariableStructure,
    TEST_TYPE_LIST,
    UserHandleStructure
} from '@modules/report-card/class/constants';

export class DesignReportCardHtmlAdapter {

    vm: DesignReportCardComponent;

    examinationTypeList = EXAMINATION_TYPE_LIST;

    selectedTableCellList = []; // {rowIndex: 0, columnIndex: 0};
    selectedBorder = 'top'; // top, right, bottom, left

    todaysDateFormatted = '';

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {

        this.vm = vm;

        const todaysDate = new Date();
        let month = '' + (todaysDate.getMonth() + 1);
        let day = '' + todaysDate.getDate();
        const year = todaysDate.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        this.todaysDateFormatted = [year, month, day].join('-');

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
        if (parameter.dataType !== DATA_TYPES.GRADING) {
            this.vm.currentUserHandle.y = 145;
            this.vm.currentUserHandle.x = 80;
        }

        if (parameter.dataType === DATA_TYPES.TEXT
            || parameter.dataType === DATA_TYPES.MARKS
            || parameter.dataType === DATA_TYPES.DATE) {
            this.vm.currentUserHandle.fontSize = 7;
        }

        if (parameter.key ===  FIELDS.EXAMINATION.fieldStructureKey + '-' + EXAMINATION_TYPE_LIST[1]) {
            this.vm.currentUserHandle.value = {
                'subGradeId': this.vm.data.subGradeList[0].id,
                'examinationId': this.vm.data.examinationList[0].id,
            };
        }
        if (parameter.key ===  FIELDS.EXAMINATION.fieldStructureKey + '-' + EXAMINATION_TYPE_LIST[2]) {
            this.vm.currentUserHandle.value = {
                'examinationId': this.vm.data.examinationList[0].id,
            };
        }
        if (parameter.field.fieldStructureKey === FIELDS.ATTENDANCE.fieldStructureKey) {
            this.vm.currentUserHandle.value = {
                'startDate': this.todaysDateFormatted,
                'endDate': this.todaysDateFormatted,
            };
        }
        if (parameter.field.fieldStructureKey === FIELDS.CONSTANT.fieldStructureKey) {
            this.vm.currentUserHandle.value = 'Text - ' + (this.vm.getFilteredCurrentUserHandleListByGivenField(parameter.field).length);
        }
        if (parameter.key === FIELDS.EXAMINATION.fieldStructureKey + '-' + EXAMINATION_TYPE_LIST[0]) {
            this.vm.currentUserHandle.formula = 'a';
            this.addMarksToMarksVariableList(this.vm.currentUserHandle.marksVariableList);
            this.giveExamMarksUserHandleAName();
        }
        if (parameter.dataType === DATA_TYPES.TABLE) {
            this.selectedTableCellList.push({
                rowIndex: 0,
                columnIndex: 0,
            });
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
        if (parameter.key === FIELDS.EXAMINATION.fieldStructureKey + '-' + EXAMINATION_TYPE_LIST[0]) {
            this.vm.currentUserHandle.name = '';
            this.giveExamMarksUserHandleAName();
        }
        if (parameter.dataType === DATA_TYPES.TABLE) {
            this.selectedTableCellList.push({
                rowIndex: 0,
                columnIndex: 0,
            });
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
            return userHandle.key ===  FIELDS.EXAMINATION.fieldStructureKey + '-' + EXAMINATION_TYPE_LIST[0]
                && userHandle.name !== this.vm.currentUserHandle.name;
        });
    }

    addMarksUserHandleToMarksVariableList(): void {
        this.vm.currentUserHandle.marksVariableList.push(this.getMarksUserHandleListExceptCurrent()[0].name);
    }

    getMarksUserHandleListWithName(name: any): boolean {
        return this.vm.currentLayout.content.filter(userHandle => {
            return userHandle.key ===  FIELDS.EXAMINATION.fieldStructureKey + '-' + EXAMINATION_TYPE_LIST[0]
                && userHandle.name === name;
        });
    }

    addTableRowBefore(): void {
        const rowIndex = this.selectedTableCellList[0].rowIndex;
        this.vm.currentUserHandle.rowList.splice(rowIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.rowList[rowIndex])));
        this.vm.currentUserHandle.horizontalLineList.splice(rowIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.horizontalLineList[rowIndex])));
        this.vm.currentUserHandle.verticalLineList.forEach(verticalLine => {
            verticalLine.splice(rowIndex, 0, JSON.parse(JSON.stringify(verticalLine[rowIndex])));
        });
        this.vm.currentUserHandle.cellList.splice(rowIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.cellList[rowIndex])));
        this.selectedTableCellList[0].rowIndex += 1;
    }

    addTableRowAfter(): void {
        const rowIndex = this.selectedTableCellList[0].rowIndex;
        this.vm.currentUserHandle.rowList.splice(rowIndex + 1, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.rowList[rowIndex])));
        this.vm.currentUserHandle.horizontalLineList.splice(rowIndex + 2, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.horizontalLineList[rowIndex + 1])));
        this.vm.currentUserHandle.verticalLineList.forEach(verticalLine => {
            verticalLine.splice(rowIndex + 1, 0, JSON.parse(JSON.stringify(verticalLine[rowIndex])));
        });
        this.vm.currentUserHandle.cellList.splice(rowIndex + 1, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.cellList[rowIndex])));
    }

    deleteTableRow(): void {
        const rowIndex = this.selectedTableCellList[0].rowIndex;
        if (this.vm.currentUserHandle.rowList.length === rowIndex + 1) {
            this.selectedTableCellList[0].rowIndex -= 1;
        }
        this.vm.currentUserHandle.rowList.splice(rowIndex, 1);
        this.vm.currentUserHandle.horizontalLineList.splice(rowIndex + 1, 1);
        this.vm.currentUserHandle.verticalLineList.forEach(verticalLine => {
            verticalLine.splice(rowIndex, 1);
        });
        this.vm.currentUserHandle.cellList.splice(rowIndex, 1);
    }

    addTableColumnBefore(): void {
        const columnIndex = this.selectedTableCellList[0].columnIndex;
        this.vm.currentUserHandle.columnList.splice(columnIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.columnList[columnIndex])));
        this.vm.currentUserHandle.verticalLineList.splice(columnIndex, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.verticalLineList[columnIndex])));
        this.vm.currentUserHandle.horizontalLineList.forEach(horizontalLine => {
            horizontalLine.splice(columnIndex, 0, JSON.parse(JSON.stringify(horizontalLine[columnIndex])));
        });
        this.vm.currentUserHandle.cellList.forEach(row => {
            row.splice(columnIndex, 0, JSON.parse(JSON.stringify(row[columnIndex])));
        });
        this.selectedTableCellList[0].columnIndex += 1;
    }

    addTableColumnAfter(): void {
        const columnIndex = this.selectedTableCellList[0].columnIndex;
        this.vm.currentUserHandle.columnList.splice(columnIndex + 1, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.columnList[columnIndex])));
        this.vm.currentUserHandle.verticalLineList.splice(columnIndex + 2, 0,
            JSON.parse(JSON.stringify(this.vm.currentUserHandle.verticalLineList[columnIndex + 1])));
        this.vm.currentUserHandle.horizontalLineList.forEach(horizontalLine => {
            horizontalLine.splice(columnIndex + 1, 0, JSON.parse(JSON.stringify(horizontalLine[columnIndex])));
        });
        this.vm.currentUserHandle.cellList.forEach(row => {
            row.splice(columnIndex + 1, 0, JSON.parse(JSON.stringify(row[columnIndex])));
        });
    }

    deleteTableColumn(): void {
        const columnIndex = this.selectedTableCellList[0].columnIndex;
        if (this.vm.currentUserHandle.columnList.length === columnIndex + 1) {
            this.selectedTableCellList[0].columnIndex -= 1;
        }
        this.vm.currentUserHandle.columnList.splice(columnIndex, 1);
        this.vm.currentUserHandle.verticalLineList.splice(columnIndex + 1, 1);
        this.vm.currentUserHandle.horizontalLineList.forEach(horizontalLine => {
            horizontalLine.splice(columnIndex, 1);
        });
        this.vm.currentUserHandle.cellList.forEach(row => {
            row.splice(columnIndex, 1);
        });
    }

    isCellSelected(rowIndex: any, columnIndex: any): boolean {
        return this.selectedTableCellList.find(selectedTableCell => {
            return selectedTableCell.rowIndex === rowIndex && selectedTableCell.columnIndex === columnIndex;
        }) !== undefined;
    }

    handleCellClick(rowIndex: any, columnIndex: any): void {
        if (this.selectedTableCellList.find(selectedTableCell => {
            return selectedTableCell.rowIndex === rowIndex && selectedTableCell.columnIndex === columnIndex;
        }) === undefined) {
            this.selectedTableCellList.push({
                rowIndex: rowIndex,
                columnIndex: columnIndex,
            });
        } else {
            this.selectedTableCellList = this.selectedTableCellList.filter(selectedTableCell => {
                return selectedTableCell.rowIndex !== rowIndex || selectedTableCell.columnIndex !== columnIndex;
            });
        }
    }

    handleCellColor(value: any): void {
        this.selectedTableCellList.forEach(selectedTableCell => {
            this.vm.currentUserHandle.cellList[selectedTableCell.rowIndex][selectedTableCell.columnIndex] = value;
        });
    }

    handleRowLength(length: any): void {
        this.selectedTableCellList.forEach(selectedTableCell => {
            this.vm.currentUserHandle.rowList[selectedTableCell.rowIndex].length = length;
        });
    }

    handleColumnLength(length: any): void {
        this.selectedTableCellList.forEach(selectedTableCell => {
            this.vm.currentUserHandle.columnList[selectedTableCell.columnIndex].length = length;
        });
    }

    handleTopBorder(value: any, variable: any): void { // variable can be 'color' or 'width'
        this.selectedTableCellList.forEach(selectedTableCell => {
            this.vm.currentUserHandle.horizontalLineList[selectedTableCell.rowIndex][selectedTableCell.columnIndex][variable] = value;
        });
    }

    handleRightBorder(value: any, variable: any): void { // variable can be 'color' or 'width'
        this.selectedTableCellList.forEach(selectedTableCell => {
            this.vm.currentUserHandle.verticalLineList[selectedTableCell.columnIndex + 1][selectedTableCell.rowIndex][variable] = value;
        });
    }

    handleBottomBorder(value: any, variable: any): void { // variable can be 'color' or 'width'
        this.selectedTableCellList.forEach(selectedTableCell => {
            this.vm.currentUserHandle.horizontalLineList[selectedTableCell.rowIndex + 1][selectedTableCell.columnIndex][variable] = value;
        });
    }

    handleLeftBorder(value: any, variable: any): void { // variable can be 'color' or 'width'
        this.selectedTableCellList.forEach(selectedTableCell => {
            this.vm.currentUserHandle.verticalLineList[selectedTableCell.columnIndex][selectedTableCell.rowIndex][variable] = value;
        });
    }

    selectAllTableCells(): void {
        this.selectedTableCellList = [];
        this.vm.currentUserHandle.rowList.forEach((row, rowIndex) => {
            this.vm.currentUserHandle.columnList.forEach((column, columnIndex) => {
                this.selectedTableCellList.push({rowIndex: rowIndex, columnIndex: columnIndex});
            });
        });
    }

    deselectAllTableCells(): void {
        this.selectedTableCellList = [];
    }

    /* Marks To Grade Rule */
    deleteMarksToGradeRule(index: any): void {
        this.vm.currentUserHandle.marksToGradeRuleList.splice(index, 1);
    }

    addMarksToGradeRule(): void {
        this.vm.currentUserHandle.marksToGradeRuleList.push({...marksToGradeRuleStructure});
    }

    gradeRuleList(): boolean {
        return this.vm.currentLayout.content.filter(userHandle => {
            return userHandle.key === FIELDS.EXAMINATION.fieldStructureKey + '-' + EXAMINATION_TYPE_LIST[3];
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

