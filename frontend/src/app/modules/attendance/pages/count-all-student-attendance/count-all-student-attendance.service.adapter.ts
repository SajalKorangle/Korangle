import { CountAllStudentAttendanceComponent } from "./count-all-student-attendance.component";
import { Query } from "@services/generic/query";

export class CountAllStudentAttendanceServiceAdapter{
    vm : CountAllStudentAttendanceComponent;

    initializeAdapter(vm: CountAllStudentAttendanceComponent) {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        const studentSectionQuery = new Query()
            .filter({
                parentStudent__parentSchool : this.vm.user.activeSchool.dbId,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
            })
            .addParentQuery(
                'parentStudent',
                new Query().setFields('name', 'fathersName', 'mobileNumber', 'secondMobileNumber')
            )
            .getObjectList({student_app: 'StudentSection'});

        const divisionQuery = new Query()
            .getObjectList({class_app : 'Division'});

        const classQuery = new Query()
            .getObjectList({class_app: 'Class'});

        await Promise.all([
            studentSectionQuery,
            divisionQuery,
            classQuery,
        ])
        .then((value) => {
            this.vm.studentSectionList = value[0];
            this.vm.divisionList = value[1];
            this.vm.classList = value[2];
        },
        (err) => {
            console.log(err);
        });

        let studentSectionIdList = [];
        this.vm.studentSectionList.forEach((studentSection) => {
            studentSectionIdList.push(studentSection['id']);
        });

        const tcQuery = new Query()
            .filter({
                parentStudentSection__in : studentSectionIdList,
            })
            .getObjectList({tc_app : 'TransferCertificateNew'});

        let tcList = [];

        [
            tcList
        ] = await Promise.all([
            tcQuery
        ]);

        tcList.forEach((tc) => {
            if (tc['status'] === 'Generated' || tc['status'] === 'Issued') {
                this.vm.studentsWithTc.push(tc['parentStudentSection']);
            }
        });

        this.vm.attendanceList = [];

        this.vm.isLoading = false;
        this.vm.isInitialLoading = false;
    }

    async populateAttendanceList() {
        this.vm.isLoading = true;

        let studentAttendanceList;
        let attendanceList = new Array(this.vm.classList.length);

        if (this.vm.selectedDate === null) {
            alert("Please select a date");
            this.vm.isLoading = false;
            this.vm.showStudentList = false;
            return;
        }

        const selectedDate = new Date(this.vm.selectedDate);
        if (selectedDate > this.vm.initialDate) {
            alert("The date should be of today or before");
            this.vm.isLoading = false;
            this.vm.showStudentList = false;
            return;
        }

        const studentAttendanceQuery = new Query()
            .filter({ parentStudent__parentSchool : this.vm.user.activeSchool.dbId, dateOfAttendance: this.vm.selectedDate})
            .getObjectList({attendance_app: 'StudentAttendance'});

        await Promise.all([
            studentAttendanceQuery,
        ])
        .then((value) => {
            studentAttendanceList = value[0];
        },
        (err) => {
            console.log(err);
        });

        for (let i = 0; i < this.vm.studentSectionList.length; ++i) {

            if (this.vm.studentsWithTc.indexOf(this.vm.studentSectionList[i]['id']) !== -1) {
                continue;
            }

            let studentAttendance = studentAttendanceList.find(student => {
                return student.parentStudent === this.vm.studentSectionList[i]['parentStudent'];
            });

            if (studentAttendance === undefined) {
                studentAttendance = {
                    'status' : 'NOT_RECORDED'
                };
            }

            let classNo = this.vm.classList[this.vm.studentSectionList[i]['parentClass'] - 1]['id'] - 1;
            let classs = this.vm.classList[this.vm.studentSectionList[i]['parentClass'] - 1]['name'];
            let division = this.vm.divisionList[this.vm.studentSectionList[i]['parentDivision'] - 1]['name'];
            let attendanceStatus = studentAttendance['status'];

            if (attendanceList[classNo]) {
                if (attendanceList[classNo][division]) {
                    ++attendanceList[classNo][division][attendanceStatus]['count'];
                    attendanceList[classNo][division][attendanceStatus]['studentSectionList'].push(this.vm.studentSectionList[i]);
                } else {
                    attendanceList[classNo][division] = {
                        'PRESENT' : {'count': 0, 'studentSectionList': []},
                        'ABSENT' : {'count': 0, 'studentSectionList': []},
                        'HOLIDAY' : {'count': 0, 'studentSectionList': []},
                        'NOT_RECORDED' : {'count': 0, 'studentSectionList': []},
                        'TOTAL' : {'count': 0, 'studentSectionList': []},
                    };
                    ++attendanceList[classNo][division][attendanceStatus]['count'];
                    attendanceList[classNo][division][attendanceStatus]['studentSectionList'].push(this.vm.studentSectionList[i]);
                }
            } else {
                attendanceList[classNo] = {
                    "name": classs,
                };
                attendanceList[classNo][division] = {
                    'PRESENT' : {'count': 0, 'studentSectionList': []},
                    'ABSENT' : {'count': 0, 'studentSectionList': []},
                    'HOLIDAY' : {'count': 0, 'studentSectionList': []},
                    'NOT_RECORDED' : {'count': 0, 'studentSectionList': []},
                    'TOTAL' : {'count': 0, 'studentSectionList': []},
                };
                ++attendanceList[classNo][division][attendanceStatus]['count'];
                attendanceList[classNo][division][attendanceStatus]['studentSectionList'].push(this.vm.studentSectionList[i]);
            }

            ++attendanceList[classNo][division]['TOTAL']['count'];
            attendanceList[classNo][division]['TOTAL']['studentSectionList'].push(this.vm.studentSectionList[i]);
        }
        this.vm.isLoading = false;
        this.vm.showStudentList = true;
        this.vm.attendanceList = attendanceList;
    }
}