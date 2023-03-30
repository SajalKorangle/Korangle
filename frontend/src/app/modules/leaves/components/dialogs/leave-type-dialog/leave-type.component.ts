import { Component, EventEmitter, Input, Output } from "@angular/core";
import { LeaveType, LeaveTypeMonth } from "@modules/leaves/classes/leaves";

@Component({
    selector: "leave-type-dialog",
    templateUrl: "./leave-type.component.html",
    styleUrls: ["./leave-type.component.css"],
})
export class LeaveTypeDialog {
    @Output() save: EventEmitter<any> = new EventEmitter<any>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    @Input() schoolLeaveType: LeaveType;
    @Input() schoolLeaveTypeMonth: Array<LeaveTypeMonth>;
    @Input() isSaving: boolean;
    @Input() InvalidNameList: Array<string>;
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
    isEncFormulaVisible: boolean = false;
    isNameValid: boolean = true;
    // prettier-ignore
    monthMap: { [id: string]: string } = {
        jan: "January", feb: "February", mar: "March", apr: "April",
        may: "May", jun: "June", jul: "July", aug: "August",
        sep: "September", oct: "October", nov: "November", dec: "December",
    };
    monthList = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    // data variables
    leaveTypeId: number = -1;
    leaveTypeName: string = "";
    leaveType: string = "";
    color: string = "";
    SchoolLeaveTypeMonthMap: { [id: string]: LeaveTypeMonth } = {};
    schoolLeaveTypeMonthList: Array<LeaveTypeMonth> = [];
    // Initialize Data
    ngOnChanges() {
        if (this.schoolLeaveType.id !== -1 && this.isSaving) {
            this.schoolLeaveTypeMonth.map((leaveTypeMonth) => {
                leaveTypeMonth.parentSchoolLeaveType = this.schoolLeaveType.id;
            });
            this.save.emit({
                database: { leaves_app: "SchoolLeaveTypeMonth" },
                operation: this.schoolLeaveTypeMonth[0].id === -1 ? "insertBatch" : "updateBatch",
                check: (data1, data2) => {
                    return [];
                },
                data: this.schoolLeaveTypeMonth,
                setVariable: "leaveTypeMonthList",
                close: true,
            });
        }
    }
    ngOnInit() {
        this.leaveTypeName = this.schoolLeaveType.leaveTypeName;
        this.leaveType = this.schoolLeaveType.leaveType;
        this.color = this.schoolLeaveType.color;
        this.isColorListVisible = false;
        this.monthList.map((month) => {
            let monthObject = this.schoolLeaveTypeMonth.find((item) => {
                return item.month === this.monthMap[month];
            });
            this.SchoolLeaveTypeMonthMap[this.monthMap[month]] = monthObject;
        });
        this.leaveTypeId = this.schoolLeaveType.id;
        let encCount: number = 0;
        this.schoolLeaveTypeMonthList = this.schoolLeaveTypeMonth;
        Object.keys(this.SchoolLeaveTypeMonthMap).map((month) => {
            encCount += this.SchoolLeaveTypeMonthMap[month].remainingLeavesAction === "Encashment" ? 1 : 0;
        });
        this.isEncFormulaVisible = encCount == 0 ? false : true;
    }
    closeColorList(event): void {
        const classNames = event.target.className.split(" ");
        if (this.isColorListVisible && classNames[0] !== "colorSelector") {
            this.isColorListVisible = false;
        }
    }
    updateColor(event, colorCode): void {
        this.color = colorCode;
        this.isColorListVisible = !this.isColorListVisible;
    }
    updateName(event): void {
        this.leaveTypeName = event.target.value;
        const similarName = this.InvalidNameList.find((name) => {
            return name.toLowerCase() === this.leaveTypeName.toLowerCase();
        });
        this.isNameValid = similarName ? false : true;
    }
    async saveData(event): Promise<void> {
        if (this.leaveTypeName.length === 0 || this.leaveType === "None" || this.color.length === 0) {
            alert("Please fill all the fields before saving the changes.");
        } else if (this.schoolLeaveType.id === -1 && !this.isNameValid) {
            alert("Name already exists.");
        } else {
            this.schoolLeaveTypeMonthList = [];
            Object.keys(this.SchoolLeaveTypeMonthMap).map((month) => {
                this.schoolLeaveTypeMonthList.push(this.SchoolLeaveTypeMonthMap[month]);
            });
            await this.save.emit({
                database: { leaves_app: "SchoolLeaveType" },
                operation: this.leaveTypeId === -1 ? "insert" : "update",
                check: (data1, data2) => {
                    let sameVariables = [];
                    if (data1.id !== data2.id && data1.leaveTypeName.toLowerCase() === data2.leaveTypeName.toLowerCase()) sameVariables.push("Name");
                    else if (data1.id != data2.id && data1.color.toLowerCase() === data2.color.toLowerCase()) sameVariables.push("Color");
                    return sameVariables;
                },
                data: [
                    {
                        id: this.leaveTypeId,
                        leaveTypeName: this.leaveTypeName,
                        leaveType: this.leaveType,
                        color: this.color,
                    },
                ],
                close: false,
                setVariable: "leaveTypeList",
                setVariableNameMap: {
                    currentSchoolLeaveType: "response",
                    currentSchoolLeaveTypeMonthList: this.schoolLeaveTypeMonthList,
                },
            });
        }
    }
    updateLeaves(event, month): void {
        this.SchoolLeaveTypeMonthMap[this.monthMap[month]].remainingLeavesAction = event.target.value;
        let encCount: number = 0;
        Object.keys(this.SchoolLeaveTypeMonthMap).map((month) => {
            encCount += this.SchoolLeaveTypeMonthMap[month].remainingLeavesAction === "Encashment" ? 1 : 0;
        });
        this.isEncFormulaVisible = encCount == 0 ? false : true;
    }
    checkInput(event): void {
        event.target.value = isNaN(parseInt(event.target.value)) ? "0" : parseInt(event.target.value) < 0 ? "0" : parseInt(event.target.value).toString();
    }
}
