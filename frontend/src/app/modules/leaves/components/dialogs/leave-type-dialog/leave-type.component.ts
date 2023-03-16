import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MonthVsLeaves } from "@modules/leaves/classes/leaves";

@Component({
    selector: "leave-type-dialog",
    templateUrl: "./leave-type.component.html",
    styleUrls: ["./leave-type.component.css"],
})
export class LeaveTypeDialog {
    @Output() save: EventEmitter<any> = new EventEmitter<any>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    @Input() data: any = {};
    // dialog variables
    // prettier-ignore
    colorCodeList: string[] = [
        '#f9ebea', '#f2d7d5', '#e6b0aa', '#d98880', '#cd6155', '#c0392b', '#a93226', '#922b21', '#943126', '#78281f',
        '#f5eef8', '#ebdef0', '#d7bde2', '#c39bd3', '#af7ac5', '#9b59b6', '#884ea0', '#76448a', '#633974', '#512e5f',
        '#eaf2f8', '#d4e6f1', '#a9cce3', '#7fb3d5', '#5499c7', '#2980b9', '#2471a3', '#1f618d', '#1a5276', '#154360',
        '#e8f8f5', '#d1f2eb', '#a3e4d7', '#76d7c4', '#48c9b0', '#1abc9c', '#17a589', '#148f77', '#117864', '#0e6251',
        '#e9f7ef', '#d4efdf', '#a9dfbf', '#7dcea0', '#52be80', '#27ae60', '#229954', '#1e8449', '#196f3d', '#145a32',
        '#fef9e7', '#fcf3cf', '#f9e79f', '#f7dc6f', '#f4d03f', '#f1c40f', '#d4ac0d', '#b7950b', '#9a7d0a', '#7d6608',
        '#fdf2e9', '#fae5d3', '#f5cba7', '#f0b27a', '#eb984e', '#e67e22', '#ca6f1e', '#af601a', '#935116', '#784212',
        '#fdfefe', '#fbfcfc', '#f7f9f9', '#f4f6f7', '#f0f3f4', '#ecf0f1', '#d0d3d4', '#b3b6b7', '#979a9a', '#7b7d7d',
        '#f4f6f6', '#eaeded', '#d5dbdb', '#bfc9ca', '#aab7b8', '#95a5a6', '#839192', '#717d7e', '#5f6a6a', '#4d5656',
        '#ebedef', '#d6dbdf', '#aeb6bf', '#85929e', '#5d6d7e', '#34495e', '#2e4053', '#283747', '#212f3c', '#1b2631',
        '#eaecee', '#d5d8dc', '#abb2b9', '#808b96', '#566573', '#2c3e50', '#273746', '#212f3d', '#1c2833', '#17202a'
    ];
    isColorListVisible: boolean = false;
    isNoteVisible: boolean = false;
    isSalaryComponentSelectorVisible: boolean = false;
    activeComponentCount: number = 0;
    salaryComponents: Array<string> = ["Base Salary", "HRA", "DA"];
    months: Array<string> = [];
    isSaving: boolean = false;
    isNew: boolean = false;
    // data variables
    name: string = "";
    leaveType: number = -1;
    color: string = "";
    leavesPerMonth: MonthVsLeaves;
    salaryComponentValue: { [id: string]: number } = {
        "Base Salary": 0,
        HRA: 0,
        DA: 0,
    };
    dividingFactorType: number = -1;
    dividingFactorValue: number = 30;
    // Initialize Data
    ngOnInit() {
        if (JSON.stringify(this.data) === "{}" || !JSON.stringify(this.data).length) {
            this.name = "";
            this.leaveType = -1;
            this.color = "";
            this.isColorListVisible = false;
            this.isSalaryComponentSelectorVisible = false;
            this.leavesPerMonth = {
                jan: [0, 0], feb: [0, 0], mar: [0, 0], apr: [0, 0],
                may: [0, 0], jun: [0, 0], jul: [0, 0], aug: [0, 0],
                sep: [0, 0], oct: [0, 0], nov: [0, 0], dec: [0, 0],
            };
            this.salaryComponentValue = {
                "Base Salary": 0, HRA: 0, DA: 0,
            };
            this.dividingFactorType = -1;
            this.dividingFactorValue = 30;
            this.isNew = true;
        } else {
            this.name = this.data.leaveTypeName;
            this.leaveType = this.data.leaveType;
            this.color = this.data.color;
            this.leavesPerMonth = JSON.parse(this.data.assignedLeavesMonthWise);
            this.salaryComponentValue = JSON.parse(this.data.salaryComponents);
            this.dividingFactorValue = this.data.divisionFactor;
            this.dividingFactorType = this.data.divisionFactorType;
            this.isNew = false;
        }
        this.activeComponentCount = 0;
        this.salaryComponents.forEach((component) => {
            this.activeComponentCount += this.salaryComponentValue[component] === 0 ? 0 : 1;
        });
        this.months = Object.keys(this.leavesPerMonth);
    }
    closeColorList(event): void {
        const classNames = event.target.className.split(" ");
        if (this.isColorListVisible && classNames[0] !== "colorSelector") {
            this.isColorListVisible = false;
        }
        if (this.isSalaryComponentSelectorVisible && classNames[0] !== "componentSelector") {
            this.isSalaryComponentSelectorVisible = false;
        }
    }
    updateColor(event, colorCode): void {
        this.color = colorCode;
        this.isColorListVisible = !this.isColorListVisible;
    }
    async saveData(event): Promise<void> {
        this.isSaving = true;
        let counter: number = 0;
        this.salaryComponents.forEach((component) => {
            counter += this.salaryComponentValue[component] !== 0 ? 1 : 0;
        });
        if (this.name.length === 0 || this.leaveType === -1 || this.color.length === 0) {
            alert("Please fill all the fields before saving the changes.");
        } else if (counter === 0) {
            alert("Please select at-least one salary component to save.");
        } else if (this.dividingFactorType === -1 || this.dividingFactorValue === 0) {
            alert("Please select a valid division factor type / value.");
        } else {
            event.data = {
                isNew: this.isNew, leaveTypeName: this.name,
                leaveType: this.leaveType, color: this.color,
                assignedLeavesMonthWise: JSON.stringify(this.leavesPerMonth),
                salaryComponents: JSON.stringify(this.salaryComponentValue),
                divisionFactor: this.dividingFactorValue, divisionFactorType: this.dividingFactorType,
            };
            event.data.id = !this.isNew ? this.data.id : -1;
            await this.save.emit(event.data);
        }
        this.isSaving = false;
    }
    updateLeaves(event, month): void {
        this.leavesPerMonth[month][1] = parseInt(event.target.value);
    }
    enableComponent(event, salaryComponent): void {
        this.activeComponentCount += this.salaryComponentValue[salaryComponent] == 0 ? 1 : -1;
        this.salaryComponentValue[salaryComponent] = this.salaryComponentValue[salaryComponent] == 0 ? 1 : 0;
    }
    getFormula(): string {
        let formula: string = "(";
        this.salaryComponents.forEach((component, index) => {
            if (this.salaryComponentValue[component] !== 0) {
                formula +=
                    (index == 0 ? (this.salaryComponentValue[component] === -1 ? " - " : " ") : this.salaryComponentValue[component] === 1 ? " + " : " - ");
                formula += component;
            }
        });
        formula += ` ) / ${this.dividingFactorValue}`;
        return formula;
    }
    updateDFType(event): void {
        this.dividingFactorType = parseInt(event.target.value);
    }
    checkInput(event): void {
        event.target.value = isNaN(parseInt(event.target.value)) ? "0" : parseInt(event.target.value) < 0 ? "0" : parseInt(event.target.value).toString();
    }
}
