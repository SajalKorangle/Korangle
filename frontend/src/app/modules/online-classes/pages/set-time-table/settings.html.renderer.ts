import { SettingsComponent } from './settings.component';
import {
    ColorPaletteHandle, ParsedOnlineClass, TimeComparator,
    TimeSpanComparator, Time, TimeSpan
} from '@modules/online-classes/class/constants';

import { NewOnlineClassDialogComponent } from '@modules/online-classes/components/new-online-class-dialog/new-online-class-dialog.component';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    colorPaletteHandle = ColorPaletteHandle;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    getOnlineClassByWeekDayAndTime(weekdayKey, timeSpan) {
        return this.vm.userInput.filteredOnlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdayKeysMappedByDisplayName[weekdayKey]
                && TimeSpanComparator(timeSpan, new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0)
                return true;
            return false;
        });
    }

    getCardSlotDisplayData(onlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        const classs = this.vm.backendData.getClassById(classSubject.parentClass);
        const section = this.vm.backendData.getDivisionById(classSubject.parentDivision);
        const employee = this.vm.backendData.getEmployeeById(classSubject.parentEmployee);
        return { subject, classs, section, employee };
    }

    openNewOnlineClassDialog(weekdayKey, timeSpan) { // check here
        let onlineClass: ParsedOnlineClass = this.getOnlineClassByWeekDayAndTime(weekdayKey, timeSpan);
        const data = {
            vm: this.vm,
            weekday: this.vm.weekdayKeysMappedByDisplayName[weekdayKey],
            timeSpan: timeSpan,
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
                        day: this.vm.weekdayKeysMappedByDisplayName[weekdayKey],
                        startTimeJSON: new Time({ ...timeSpan.startTime }),
                        endTimeJSON: new Time({ ...timeSpan.endTime }),
                    };
                    this.vm.userInput.filteredOnlineClassList.push(onlineClass);
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

    setupEditTimeSpan(editTimeSpanFormIndex: number) {
        console.log('editTimeSpanFormIndex: ' + editTimeSpanFormIndex);
        this.vm.userInput.editTimeSpanFormIndex = editTimeSpanFormIndex;
        this.vm.userInput.timeSpanFormInput = {
            startTime: this.vm.userInput.timeSpanList[this.vm.userInput.editTimeSpanFormIndex].startTime.getString(),
            endTime: this.vm.userInput.timeSpanList[this.vm.userInput.editTimeSpanFormIndex].endTime.getString()
        };
    }

    endTimeBeforeStartTime(): boolean {
        const startTimeArray = this.vm.userInput.timeSpanFormInput.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.timeSpanFormInput.endTime.split(':').map(t => parseInt(t));
        if (endTimeArray[0] < startTimeArray[0])
            return true;
        else if (endTimeArray[0] == startTimeArray[0] && endTimeArray[1] < startTimeArray[1])
            return true;
        return false;
    }

    timeSpanOverlapping(): boolean {
        const startTimeArray = this.vm.userInput.timeSpanFormInput.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.timeSpanFormInput.endTime.split(':').map(t => parseInt(t));
        const newStartTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const newEndTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        let result: boolean = TimeComparator(newStartTime, newEndTime) == 0;

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

    isOnlineClassOverlappingWithDifferentClass(concernedOnlineClass: ParsedOnlineClass): boolean {
        const concernedClassSubject = this.vm.backendData.getClassSubjectById(concernedOnlineClass.parentClassSubject);
        const bookedSlotOnlineClass = this.vm.backendData.onlineClassList.find(onlineClass => {
            const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
            if (classSubject.parentEmployee != concernedClassSubject.parentEmployee) {
                return false;
            }
            if (classSubject.parentClass == concernedClassSubject.parentClass) {
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


    isOnlineClassSectionOverlappingWithDifferentSection(concernedOnlineClass: ParsedOnlineClass): boolean {
        const concernedClassSubject = this.vm.backendData.getClassSubjectById(concernedOnlineClass.parentClassSubject);
        const bookedSlotOnlineClass = this.vm.backendData.onlineClassList.find(onlineClass => {
            const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
            if (classSubject.parentEmployee != concernedClassSubject.parentEmployee) {
                return false;
            }
            if (classSubject.parentClass != concernedClassSubject.parentClass)
                return false;
            if (onlineClass == concernedOnlineClass) {
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

    getOverlappingOnlineClassInfo(concernedOnlineClass: ParsedOnlineClass) {
        const concernedClassSubject = this.vm.backendData.getClassSubjectById(concernedOnlineClass.parentClassSubject);
        const bookedSlotOnlineClassList = this.vm.backendData.onlineClassList.filter(onlineClass => {
            const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
            if (classSubject.parentEmployee != concernedClassSubject.parentEmployee) {
                return false;
            }
            if (onlineClass == concernedOnlineClass)
                return false;
            if (concernedOnlineClass.day == onlineClass.day
                && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                return true;
            }
        });
        let displayString = "";
        bookedSlotOnlineClassList.forEach(bookedSlotOnlineClass => {
            const info = this.getCardSlotDisplayData(bookedSlotOnlineClass);
            displayString += "[ " + bookedSlotOnlineClass.startTimeJSON.getDisplayString() + ' - '
                + bookedSlotOnlineClass.endTimeJSON.getDisplayString() + ': ' + info.subject.name
                + ` (${info.classs.name} & ${info.section.name}) ], `;
        });
        return displayString;
    }

    nonEditingTimeSpanList(): Array<TimeSpan> {
        return this.vm.userInput.timeSpanList.filter((timeSpan, timeSpanIndex) => timeSpanIndex != this.vm.userInput.editTimeSpanFormIndex);
    }

    newTimeSpanError = (): boolean => {
        if (this.endTimeBeforeStartTime() || this.timeSpanOverlapping())
            return true;
        return false;
    };

    editTimeSpanError = (): boolean => {
        if (this.endTimeBeforeStartTime() || this.timeSpanOverlapping() || this.isEditingTimeSpanOverlapping())
            return true;
        return false;
    };

    addNewTimeSpan() {
        const startTimeArray = this.vm.userInput.timeSpanFormInput.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.timeSpanFormInput.endTime.split(':').map(t => parseInt(t));
        const startTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const endTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        this.vm.userInput.timeSpanList = [...this.vm.userInput.timeSpanList, new TimeSpan({ startTime, endTime })];
        this.vm.userInput.resetNewTimeSpanData();
    }

    isEditingTimeSpanOverlapping(): boolean {
        const startTimeArray = this.vm.userInput.timeSpanFormInput.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.timeSpanFormInput.endTime.split(':').map(t => parseInt(t));
        const startTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const endTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        return this.vm.userInput.filteredOnlineClassList.every(onlineClass => {
            if (TimeSpanComparator(this.vm.userInput.timeSpanList[this.vm.userInput.editTimeSpanFormIndex],
                new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0) {
                return this.isOnlineClassOverlappingWithDifferentClass({ ...onlineClass, startTimeJSON: startTime, endTimeJSON: endTime }) == false;
            }
            return true;
        }) == false;
    }

    editTimeSpan() {
        const startTimeArray = this.vm.userInput.timeSpanFormInput.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.timeSpanFormInput.endTime.split(':').map(t => parseInt(t));
        const startTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const endTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });

        this.vm.userInput.filteredOnlineClassList.forEach(onlineClass => {
            if (TimeSpanComparator(this.vm.userInput.timeSpanList[this.vm.userInput.editTimeSpanFormIndex],
                new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0) {
                onlineClass.startTimeJSON = new Time({ ...startTime });
                onlineClass.endTimeJSON = new Time({ ...endTime });
            }
        });

        this.vm.userInput.timeSpanList[this.vm.userInput.editTimeSpanFormIndex].startTime = startTime;
        this.vm.userInput.timeSpanList[this.vm.userInput.editTimeSpanFormIndex].endTime = endTime;
        this.vm.userInput.timeSpanList.sort(TimeSpanComparator);
        this.vm.userInput.resetNewTimeSpanData();
        this.vm.userInput.editTimeSpanFormIndex = -1;    //close editing form
    }

    deleteTimeSpan() {
        this.vm.userInput.filteredOnlineClassList.forEach(onlineClass => {
            if (TimeSpanComparator(this.vm.userInput.timeSpanList[this.vm.userInput.editTimeSpanFormIndex],
                new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0) {
                this.vm.userInput.filteredOnlineClassList.splice(this.vm.userInput.filteredOnlineClassList.indexOf(onlineClass), 1);
            }
        });
        this.vm.userInput.timeSpanList.splice(this.vm.userInput.editTimeSpanFormIndex, 1);
        this.vm.userInput.editTimeSpanFormIndex = -1;
    }

    deleteOnlineClass(onlineClass) {
        const onlineClassIndex = this.vm.userInput.filteredOnlineClassList.indexOf(onlineClass);
        this.vm.userInput.filteredOnlineClassList.splice(onlineClassIndex, 1);
    }

    getOnlineClassIndex(onlineClass): number {
        return this.vm.userInput.filteredOnlineClassList.indexOf(onlineClass);
    }

    moveOnlineClass(event, weekdayKey: string, timeSpan: TimeSpan) {
        const onlineClassIndex = parseInt(event.dataTransfer.getData('onlineClassIndex'));
        let onlineClass = this.vm.userInput.filteredOnlineClassList[onlineClassIndex];

        // overlapping slot check
        const dummyOnlineClass = {
            ...onlineClass,
            day: this.vm.weekdayKeysMappedByDisplayName[weekdayKey],
            startTimeJSON: new Time({ ...timeSpan.startTime }),
            endTimeJSON: new Time({ ...timeSpan.endTime })
        };
        if (this.isOnlineClassOverlappingWithDifferentClass(dummyOnlineClass)) {
            console.log("online class overlapping");
            this.vm.snackBar.open("Teacher's is slot overlapping", undefined, { duration: 7500 });
            return;
        }

        if (event.shiftKey) {
            onlineClass = { ...onlineClass, id: null };
            this.vm.userInput.filteredOnlineClassList.push(onlineClass);
        }
        onlineClass.day = this.vm.weekdayKeysMappedByDisplayName[weekdayKey];
        onlineClass.startTimeJSON = new Time({ ...timeSpan.startTime });
        onlineClass.endTimeJSON = new Time({ ...timeSpan.endTime });
    }

    swapOnlineClass(event, onlineClass2: ParsedOnlineClass) {
        const onlineClass1 = this.vm.userInput.filteredOnlineClassList[event.dataTransfer.getData('onlineClassIndex')];
        if (event.shiftKey) {
            // possible time slot overlap checking
            const dummyOnlineClass = { ...onlineClass2, parentClassSubject: onlineClass1.parentClassSubject };
            if (this.isOnlineClassOverlappingWithDifferentClass(dummyOnlineClass)) {
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
        if (this.isOnlineClassOverlappingWithDifferentClass(onlineClass1) || this.isOnlineClassOverlappingWithDifferentClass(onlineClass2)) {
            this.vm.snackBar.open("Teacher's is slot overlapping", undefined, { duration: 7500 });
            [onlineClass1.day, onlineClass2.day] = [onlineClass2.day, onlineClass1.day];
            [onlineClass1.startTimeJSON, onlineClass2.startTimeJSON] = [onlineClass2.startTimeJSON, onlineClass1.startTimeJSON];
            [onlineClass1.endTimeJSON, onlineClass2.endTimeJSON] = [onlineClass2.endTimeJSON, onlineClass1.endTimeJSON];
            return;
        }
    }

    getOnlineClassByWeekDayAndStartTime(weekdayKey, startTime: Time) {
        return this.vm.userInput.filteredOnlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdayKeysMappedByDisplayName[weekdayKey]
                && TimeComparator(startTime, onlineClass.startTimeJSON) == 0)
                return true;
            return false;
        });
    }

    getOnlineClassRowSpan(onlineClass: ParsedOnlineClass): number {
        const startTimeIndex = this.vm.userInput.employeeTimeBreakPoints.findIndex(time => {
            return TimeComparator(time, onlineClass.startTimeJSON) == 0;
        });
        const endTimeIndex = this.vm.userInput.employeeTimeBreakPoints.findIndex(time => {
            return TimeComparator(time, onlineClass.endTimeJSON) == 0;
        });
        return endTimeIndex - startTimeIndex;
    }

    isCellOccupiedDueToRowSpan(weekdayKey, time: Time) {
        return this.vm.userInput.filteredOnlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdayKeysMappedByDisplayName[weekdayKey]
                && TimeComparator(time, onlineClass.startTimeJSON) >= 0
                && TimeComparator(time, onlineClass.endTimeJSON) < 0)
                return true;
            return false;
        }) == undefined;
    }

    isAnyClassOverlapping() {
        const result = this.vm.userInput.filteredOnlineClassList.every(onlineClass => !this.isOnlineClassOverlappingWithDifferentClass(onlineClass));
        return result == false;
    }

    isAnyClassSectionOverlapping() {
        const result = this.vm.userInput.filteredOnlineClassList.every(onlineClass => !this.isOnlineClassSectionOverlappingWithDifferentSection(onlineClass));
        return result == false;
    }

}
