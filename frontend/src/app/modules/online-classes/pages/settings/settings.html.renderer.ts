import { SettingsComponent } from './settings.component';
import {
    ColorPaletteHandle, ParsedOnlineClass, getDefaultTimeSpanList, TimeComparator,
    TimeSpanComparator, Time, TimeSpan
} from '@modules/online-classes/class/constants';

import { NewOnlineClassDialogComponent } from '@modules/online-classes/components/new-online-class-dialog/new-online-class-dialog.component';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    timeSpanList: Array<TimeSpan> = getDefaultTimeSpanList();

    newTimeSpanForm: boolean = false;
    editTimeSpanFormIndex: number = -1;

    filteredOnlineClassList: Array<ParsedOnlineClass> = [];

    colorPaletteHandle = ColorPaletteHandle;

    employeeKeyTimeList: Array<Time>;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    initilizeTimeTable() {
        this.editTimeSpanFormIndex = -1;    // reset display for new time table
        this.newTimeSpanForm = false;

        if (JSON.stringify(this.timeSpanList) == JSON.stringify(getDefaultTimeSpanList())) {
            this.timeSpanList = []; // if default then empty
        }

        if (this.vm.view == 'class') {
            if (!(this.vm.userInput.selectedClass && this.vm.userInput.selectedSection))
                return;
            ColorPaletteHandle.reset();
            // filter online classes for selected class and section
            this.filteredOnlineClassList = this.vm.backendData.onlineClassList.filter((onlineClass) => {
                const classSubject = this.vm.backendData.classSubjectList.find(cs => cs.id == onlineClass.parentClassSubject);
                if (classSubject.parentClass == this.vm.userInput.selectedClass.id
                    && classSubject.parentDivision == this.vm.userInput.selectedSection.id) {
                    return true;
                }
                return false;
            });
        } else {
            if (!this.vm.userInput.selectedEmployee)
                return;
            ColorPaletteHandle.reset();
            // filter online classes for selected class and section
            this.filteredOnlineClassList = this.vm.backendData.onlineClassList.filter((onlineClass) => {
                const classSubject = this.vm.backendData.classSubjectList.find(cs => cs.id == onlineClass.parentClassSubject);
                if (classSubject.parentEmployee == this.vm.userInput.selectedEmployee.id) {
                    return true;
                }
                return false;
            });

            this.employeeKeyTimeList = [];
            this.filteredOnlineClassList.forEach(onlineClass => {
                let startTimeAlreadyPresent: boolean = false;
                let endTimeAlreadyPresent: boolean = false;
                this.employeeKeyTimeList.forEach(timeSpan => {
                    if (TimeComparator(onlineClass.startTimeJSON, timeSpan) == 0) {
                        startTimeAlreadyPresent = true;
                    }
                    if (TimeComparator(onlineClass.endTimeJSON, timeSpan) == 0) {
                        endTimeAlreadyPresent = true;
                    }
                });
                if (!startTimeAlreadyPresent) {
                    this.employeeKeyTimeList.push(new Time({ ...onlineClass.startTimeJSON }));
                }
                if (!endTimeAlreadyPresent) {
                    this.employeeKeyTimeList.push(new Time({ ...onlineClass.endTimeJSON }));
                }
            });
            this.employeeKeyTimeList.sort(TimeComparator);
            return;
        }

        this.filteredOnlineClassList.forEach(onlineClass => {
            let result: boolean = false;
            this.timeSpanList.every(timeSpan => {
                if (TimeComparator(onlineClass.startTimeJSON, timeSpan.endTime) == -1
                    && TimeComparator(timeSpan.startTime, onlineClass.endTimeJSON) == -1) {
                    result = true;
                    return false;
                }
                return true;
            });
            if (!result) {
                this.timeSpanList.push(new TimeSpan(
                    {
                        startTime: new Time({ ...onlineClass.startTimeJSON }),
                        endTime: new Time({ ...onlineClass.endTimeJSON })
                    }));
            }
        });
        if (this.timeSpanList.length == 0) {
            this.timeSpanList = getDefaultTimeSpanList();
        }
        this.timeSpanList.sort(TimeSpanComparator);
    }

    getOnlineClassByWeekDayAndTime(weekdayKey, timespan) {
        return this.filteredOnlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeSpanComparator(timespan, new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0)
                return true;
            return false;
        });
    }

    getDisplayData(onlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        const classs = this.vm.backendData.getClassById(classSubject.parentClass);
        const section = this.vm.backendData.getDivisionById(classSubject.parentDivision);
        const employee = this.vm.backendData.getEmployeeById(classSubject.parentEmployee);
        return { classSubject, subject, classs, section, employee };
    }

    openNewOnlineClassDalog(weekdayKey, timespan) { // check here
        // console.log(this.vm.backendData);
        let onlineClass: ParsedOnlineClass = this.getOnlineClassByWeekDayAndTime(weekdayKey, timespan);
        const data = {
            vm: this.vm,
            weekday: this.vm.weekdays[weekdayKey],
            timespan,
            onlineClass
        };
        const onlineClassDialog = this.vm.dialog.open(NewOnlineClassDialogComponent, {
            data
        });

        onlineClassDialog.afterClosed().subscribe((data: any) => {
            if (data && data.parentClassSubject) {
                if (!onlineClass) {
                    onlineClass = {
                        parentClassSubject: data.parentClassSubject,
                        day: this.vm.weekdays[weekdayKey],
                        startTimeJSON: new Time({ ...timespan.startTime }),
                        endTimeJSON: new Time({ ...timespan.endTime }),
                    };
                    this.filteredOnlineClassList.push(onlineClass);
                }
                else {
                    Object.assign(onlineClass, data);
                }
            }
        });
    }

    getClassDivisionName(classId, divisionId) {
        const classInstance = this.vm.backendData.classList.find(c => c.id == classId);
        const divisionInstance = this.vm.backendData.divisionList.find(d => d.id == divisionId);
        return classInstance.name + ' - ' + divisionInstance.name;
    }

    setupEditTimeSpan() {
        this.vm.userInput.newTimeSpan = {
            startTime: this.timeSpanList[this.editTimeSpanFormIndex].startTime.getString(),
            endTime: this.timeSpanList[this.editTimeSpanFormIndex].endTime.getString()
        };
    }

    endTimeBeforeStartTime(): boolean {
        const startTimeArray = this.vm.userInput.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        if (endTimeArray[0] < startTimeArray[0])
            return true;
        else if (endTimeArray[0] == startTimeArray[0] && endTimeArray[1] < startTimeArray[1])
            return true;
        return false;
    }

    timeSpanOverlapping(): boolean {
        const startTimeArray = this.vm.userInput.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        const newStartTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const newEndTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        let result: boolean = false;

        const filteredTimeSpans = this.nonEditingTimeSpanList();
        filteredTimeSpans.every(timeSpan => {
            if (TimeComparator(newStartTime, timeSpan.endTime) == -1
                && TimeComparator(timeSpan.startTime, newEndTime) == -1) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    // teacherSlotOverlapping() {
    //     const startTimeArray = this.vm.userInput.newTimeSpan.startTime.split(':').map(t => parseInt(t));
    //     const endTimeArray = this.vm.userInput.newTimeSpan.endTime.split(':').map(t => parseInt(t));
    //     const newStartTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
    //     const newEndTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
    //     // this.editTimeSpanFormIndex
    // }

    isOnlineClasOverlapping(concernedOnlineClass: ParsedOnlineClass): boolean {
        const concernedOnlineCassParentEmployee = this.vm.backendData.getClassSubjectById(concernedOnlineClass.parentClassSubject);
        const bookedSlotOnlineClass = this.vm.backendData.onlineClassList.find(onlineClass => {
            const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
            if (classSubject.parentEmployee != concernedOnlineCassParentEmployee.parentEmployee) {
                return false;
            }
            if (classSubject.parentClass == this.vm.userInput.selectedClass.id
                && classSubject.parentDivision == this.vm.userInput.selectedSection.id) {
                return false;
            }
            if (concernedOnlineClass.day == onlineClass.day
                && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                return true;
            }
        });
        return Boolean(bookedSlotOnlineClass);
    }

    nonEditingTimeSpanList(): Array<TimeSpan> {
        return this.timeSpanList.filter((timeSpan, timeSpanIndex) => timeSpanIndex != this.editTimeSpanFormIndex);
    }

    newTimeSpanError = (): boolean => {
        if (this.endTimeBeforeStartTime() || this.timeSpanOverlapping())
            return true;
        return false;
    };

    editTimeSpanError = (): boolean => {
        if (this.endTimeBeforeStartTime() || this.timeSpanOverlapping())
            return true;
        return false;
    };

    addNewTimeSpan() {
        const startTimeArray = this.vm.userInput.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        const startTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const endTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        this.timeSpanList.push(new TimeSpan({ startTime, endTime }));
        this.timeSpanList.sort(TimeSpanComparator);
        this.vm.userInput.resetNewTimeSpanData();
    }

    editTimeSpan() {
        const startTimeArray = this.vm.userInput.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        const startTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const endTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });

        this.filteredOnlineClassList.forEach(onlineClass => {
            if (TimeSpanComparator(this.timeSpanList[this.editTimeSpanFormIndex],
                new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0) {
                onlineClass.startTimeJSON = new Time({ ...startTime });
                onlineClass.endTimeJSON = new Time({ ...endTime });
            }
        });

        this.timeSpanList[this.vm.htmlRenderer.editTimeSpanFormIndex].startTime = startTime;
        this.timeSpanList[this.vm.htmlRenderer.editTimeSpanFormIndex].endTime = endTime;
        this.timeSpanList.sort(TimeSpanComparator);
        this.vm.userInput.resetNewTimeSpanData();
        this.vm.htmlRenderer.editTimeSpanFormIndex = -1;    //close editing form
    }

    deleteTimeSpan() {
        this.filteredOnlineClassList = this.filteredOnlineClassList.filter(onlineClass => {
            if (TimeSpanComparator(this.timeSpanList[this.editTimeSpanFormIndex],
                new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0)
                return false;
            return true;
        });
        this.timeSpanList.splice(this.editTimeSpanFormIndex, 1);
        this.editTimeSpanFormIndex = -1;
    }

    deleteOnlineClass(onlineClass) {
        const onlineClassIndex = this.filteredOnlineClassList.findIndex(oc => oc == onlineClass);
        this.filteredOnlineClassList.splice(onlineClassIndex, 1);
    }

    getOnlineClassIndex(onlineClass): number {
        return this.filteredOnlineClassList.findIndex(oc => oc == onlineClass);
    }

    moveOnlineClass(event, weekdayKey: string, timespan: TimeSpan) {
        const onlineClassIndex = parseInt(event.dataTransfer.getData('onlineClassIndex'));
        let onlineClass = this.filteredOnlineClassList[onlineClassIndex];

        // overlapping slot check
        const dummyOnlineClass = { ...onlineClass, day: this.vm.weekdays[weekdayKey], startTimeJSON: new Time({ ...timespan.startTime }), endTimeJSON: new Time({ ...timespan.endTime }) };
        if (this.isOnlineClasOverlapping(dummyOnlineClass)) {
            console.log("online class overlapping");
            this.vm.snackBar.open("Teacher's is slot overlapping", undefined, { duration: 7500 });
            return;
        }

        if (event.shiftKey) {
            onlineClass = { ...onlineClass, id: null };
            this.filteredOnlineClassList.push(onlineClass);
        }
        onlineClass.day = this.vm.weekdays[weekdayKey];
        onlineClass.startTimeJSON = new Time({ ...timespan.startTime });
        onlineClass.endTimeJSON = new Time({ ...timespan.endTime });
    }

    swapOnlineClass(event, onlineClass2: ParsedOnlineClass) {
        const onlineClass1 = this.filteredOnlineClassList[event.dataTransfer.getData('onlineClassIndex')];
        if (event.shiftKey) {
            // possible time slot overlap cheking
            const dummyOnlineClass = { ...onlineClass2, parentClassSubject: onlineClass1.parentClassSubject };
            if (this.isOnlineClasOverlapping(dummyOnlineClass)) {
                this.vm.snackBar.open("Teacher's is slot overlapping", undefined, { duration: 7500 });
                return;
            }
            onlineClass2.parentClassSubject = onlineClass1.parentClassSubject;
            return;
        }
        [onlineClass1.day, onlineClass2.day] = [onlineClass2.day, onlineClass1.day];
        [onlineClass1.startTimeJSON, onlineClass2.startTimeJSON] = [onlineClass2.startTimeJSON, onlineClass1.startTimeJSON];
        [onlineClass1.endTimeJSON, onlineClass2.endTimeJSON] = [onlineClass2.endTimeJSON, onlineClass1.endTimeJSON];
        // overlapping checking and fix
        if (this.isOnlineClasOverlapping(onlineClass1) || this.isOnlineClasOverlapping(onlineClass2)) {
            this.vm.snackBar.open("Teacher's is slot overlapping", undefined, { duration: 7500 });
            [onlineClass1.day, onlineClass2.day] = [onlineClass2.day, onlineClass1.day];
            [onlineClass1.startTimeJSON, onlineClass2.startTimeJSON] = [onlineClass2.startTimeJSON, onlineClass1.startTimeJSON];
            [onlineClass1.endTimeJSON, onlineClass2.endTimeJSON] = [onlineClass2.endTimeJSON, onlineClass1.endTimeJSON];
            return;
        }
    }

    getOnlineClassByWeekDayAndStartTime(weekdayKey, startTime: Time) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeComparator(startTime, onlineClass.startTimeJSON) == 0)
                return true;
            return false;
        });
    }

    getOnlineClassRowSpan(onlineClass: ParsedOnlineClass): number {
        const startTimeIndex = this.employeeKeyTimeList.findIndex(time => {
            return TimeComparator(time, onlineClass.startTimeJSON) == 0;
        });
        const endTimeIndex = this.employeeKeyTimeList.findIndex(time => {
            return TimeComparator(time, onlineClass.endTimeJSON) == 0;
        });
        return endTimeIndex - startTimeIndex;
    }

    shouldRenderEmptyTd(weekdayKey, time: Time) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeComparator(time, onlineClass.startTimeJSON) >= 0
                && TimeComparator(time, onlineClass.endTimeJSON) < 0)
                return true;
            return false;
        }) == undefined;
    }

    isAnyClassOverlapping() {
        const result = this.filteredOnlineClassList.every(onlineClass => !this.isOnlineClasOverlapping(onlineClass));
        return result == false;
    }

}
