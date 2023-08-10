export class School {
    dbId = 0;
    name: string; // School Name (for sidebar)
    printName: string;
    profileImage: string;
    principalSignatureImage: string;
    mobileNumber: number;
    primaryThemeColor = 'red';
    secondaryThemeColor = 'danger';
    diseCode = 0;

    address = '';
    pincode: number;
    villageCity: string;
    block: string;
    district: string;
    state: string;

    currentSessionDbId: number;
    currentWorkingSessionDbId: number;
    registrationNumber: string;
    affiliationNumber: string;

    expired: boolean;
    dateOfExpiry = null;

    opacity: number;

    headerSize: string;

    parentBoard: number;

    medium: string;

    role: string;

    employeeId: number;

    moduleList = [];
    studentList = [];
    parentModuleList = [];
    
    pendingBillList = [];
    isSuspended = false;
    showPageHeaderWarning = false;
    showModalWarning = false;

    fromServerObject(schoolData: any) {
        this.dbId = schoolData.dbId;
        this.name = schoolData.name;
        this.printName = schoolData.printName;
        this.mobileNumber = schoolData.mobileNumber;
        this.profileImage = schoolData.profileImage;
        this.principalSignatureImage = schoolData.principalSignatureImage;
        this.primaryThemeColor = schoolData.primaryThemeColor;
        this.secondaryThemeColor = schoolData.secondaryThemeColor;
        this.diseCode = schoolData.schoolDiseCode;

        this.address = schoolData.schoolAddress;
        this.pincode = schoolData.pincode;
        this.villageCity = schoolData.villageCity;
        this.block = schoolData.block;
        this.district = schoolData.district;
        this.state = schoolData.state;

        this.opacity = schoolData.opacity;
        this.currentSessionDbId = schoolData.currentSessionDbId;
        this.currentWorkingSessionDbId = schoolData.currentSessionDbId;
        this.registrationNumber = schoolData.registrationNumber;
        this.affiliationNumber = schoolData.affiliationNumber;

        this.headerSize = schoolData.headerSize;

        this.medium = schoolData.medium;

        this.role = schoolData.role;

        this.employeeId = schoolData.employeeId;

        this.expired = schoolData.expired;
        this.dateOfExpiry = schoolData.dateOfExpiry;

        this.parentBoard = schoolData.parentBoard;

        this.pendingBillList = schoolData.pendingBillList;

        if ('employeeId' in schoolData && schoolData['employeeId'] !== null) {

            let todaysDate = new Date();
            this.pendingBillList.every(bill => {
                let billDate = new Date(bill.billDate + 'T23:59:59');
                this.isSuspended = this.isSuspended ||
                    (todaysDate.getTime() - Math.abs(billDate.getTime())) / (1000 * 60 * 60 * 24) > bill.functionalityBlockedInterval;
                return !this.isSuspended;
            });
    
            this.moduleList = schoolData.moduleList;
            
            if(this.moduleList.find(module => {
                return module.taskList.find(task => {
                    return task.blockWhenSuspended;
                }) != undefined;
            })) {
                this.pendingBillList.every(bill => {
                    let billDate = new Date(bill.billDate + 'T23:59:59');
                    this.showPageHeaderWarning = this.showPageHeaderWarning ||
                        (todaysDate.getTime() - Math.abs(billDate.getTime())) / (1000 * 60 * 60 * 24) > bill.pageHeaderWarningInterval;
                    this.showModalWarning = this.showModalWarning ||
                        (todaysDate.getTime() - Math.abs(billDate.getTime())) / (1000 * 60 * 60 * 24) > bill.modalWarningInterval;
                    return !(this.isSuspended && this.showModalWarning);
                })
            }

            this.moduleList.push({
                dbId: null,
                path: 'job',
                title: 'Job Details',
                icon: 'work',
                taskList: [
                    {
                        dbId: null,
                        path: 'view_profile',
                        title: 'View Profile',
                    },
                    {
                        dbId: null,
                        path: 'view_attendance',
                        title: 'View Attendance',
                    },
                    {
                        dbId: null,
                        path: 'apply_leave',
                        title: 'Apply Leave',
                    },
                    {
                        dbId: null,
                        path: 'view_payment',
                        title: 'View Payment',
                    },
                ],
            });
            this.moduleList.forEach((module) => {
                module.showTaskList = false;
            });
        }

        this.studentList = schoolData.studentList;
        this.studentList.forEach((student) => {
            student.showTaskList = false;
            student.taskList = [
                {
                    title: 'Profile',
                    path: 'view_profile',
                    icon: 'account_circle',
                },
                {
                    title: 'Attendance',
                    path: 'view_attendance',
                    icon: 'account_circle',
                },
                {
                    title: 'Marks',
                    path: 'view_marks',
                    icon: 'receipt',
                },
                {
                    title: 'Tutorials',
                    path: 'view_tutorials',
                    icon: 'video_library',
                },
                {
                    title: 'Homework',
                    path: 'view_homework',
                    icon: 'assignment',
                },
                {
                    title: 'Join Class',
                    path: 'join_class',
                    icon: 'video_camera_front',
                },
            ];
        });

        if (this.studentList.length > 0) {
            this.parentModuleList.push({
                name: this.studentList[0].fathersName,
                studentList: this.studentList,
                id: this.studentList[0].id,
                taskList: [
                    {
                        title: 'Pay Fees',
                        path: 'pay_fees',
                        icon: 'receipt',
                    },
                ],
            });
            this.parentModuleList.push({
                name: this.name,
                studentList: this.studentList,
                id: this.studentList[0].id,
                taskList: [
                    {
                        title: 'Events',
                        path: 'view_event',
                        icon: 'event',
                    },
                ],
            });

            this.parentModuleList.push({
                name: 'Parent Support',
                studentList: this.studentList,
                id: this.studentList[0].id,
                taskList: [
                    {
                        title: 'Raise complaint',
                        path: 'raise_complaint',
                        icon: 'question_answer',
                    },
                ],
            });
        }
    }
}
