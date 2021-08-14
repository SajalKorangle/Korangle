import { TeachClassComponent } from './teach-class.component';
import { TimeComparator, Time, ColorPaletteHandle, ParsedOnlineClass } from '@modules/online-classes/class/constants';
import { Division } from '@services/modules/class/models/division';

export class TeachClassHtmlRenderer {

    vm: TeachClassComponent;

    timeBreakPoints: Array<Time>;

    colorPaletteHandle = ColorPaletteHandle;

    constructor() { }

    initialize(vm: TeachClassComponent): void {
        this.vm = vm;
    }

    getOverlappingFilteredOnlineClassList(): Array<ParsedOnlineClass> {
        const onlineClassList = [...this.vm.backendData.onlineClassList];
        onlineClassList.forEach((concernedOnlineClass) => {
            if (!concernedOnlineClass)
                return;
            onlineClassList.forEach((onlineClass, index) => {
                if (onlineClass.id == concernedOnlineClass.id) {
                    return false;
                }
                if (concernedOnlineClass.day == onlineClass.day
                    && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                    && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                    onlineClassList.splice(index, 1);
                }
            });
        });
        return onlineClassList;
    }

    getCurrentTime() {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });
        return customTime.getDisplayString();
    }

    getCardSlotDisplayData(onlineClass: ParsedOnlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        const classInstance = this.vm.backendData.getClassById(classSubject.parentClass);
        const division = this.vm.backendData.getDivisionById(classSubject.parentDivision);
        return { subject, classInstance, division };
    }

    isActive(onlineClass: ParsedOnlineClass): boolean {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });

        const timeDiffStart = onlineClass.startTimeJSON.diffInMinutes(customTime);
        const timeDiffEnd = onlineClass.endTimeJSON.diffInMinutes(customTime);
        if (timeDiffStart >= 0 && timeDiffEnd <= 0) {
            return true;
        }
        return false;
    }

    getActiveClass() {
        return this.getOverlappingFilteredOnlineClassList().find(onlineClass => onlineClass.day == this.vm.todayDisplayName && this.isActive(onlineClass));
    }

    getOnlineClassByWeekDayAndStartTime(weekdayKey, startTime: Time) {
        return this.getOverlappingFilteredOnlineClassList().find(onlineClass => {
            if (onlineClass.day == this.vm.weekdayKeysMappedByDisplayName[weekdayKey]
                && TimeComparator(startTime, onlineClass.startTimeJSON) == 0)
                return true;
            return false;
        });
    }

    getOnlineClassRowSpan(onlineClass: ParsedOnlineClass): number {
        const startTimeIndex = this.timeBreakPoints.findIndex(time => {
            return TimeComparator(time, onlineClass.startTimeJSON) == 0;
        });
        const endTimeIndex = this.timeBreakPoints.findIndex(time => {
            return TimeComparator(time, onlineClass.endTimeJSON) == 0;
        });
        return endTimeIndex - startTimeIndex;
    }

    isCellOccupiedDueToRowSpan(weekdayKey, time: Time) {
        return this.getOverlappingFilteredOnlineClassList().find(onlineClass => {
            if (onlineClass.day == this.vm.weekdayKeysMappedByDisplayName[weekdayKey]
                && TimeComparator(time, onlineClass.startTimeJSON) >= 0
                && TimeComparator(time, onlineClass.endTimeJSON) < 0)
                return true;
            return false;
        }) == undefined;
    }

    onlineClassListHasOverlappingError(concernedOnlineClass: ParsedOnlineClass): boolean {
        const concernedClassSubject = this.vm.backendData.getClassSubjectById(concernedOnlineClass.parentClassSubject);
        const overlappingSlotOnlineClass = this.vm.backendData.onlineClassList.find(onlineClass => {
            const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);

            if (classSubject.parentClass == concernedClassSubject.parentClass && classSubject.parentSubject == concernedClassSubject.parentSubject) {
                return false;
            }
            if (concernedOnlineClass.day == onlineClass.day
                && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                return true;
            }
        });
        return Boolean(overlappingSlotOnlineClass);
    }

    getOverlappingOnlineClassInfo(concernedOnlineClass: ParsedOnlineClass) {
        const concernedClassSubject = this.vm.backendData.getClassSubjectById(concernedOnlineClass.parentClassSubject);
        const bookedSlotOnlineClassList = this.vm.backendData.onlineClassList.filter(onlineClass => {
            const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);

            if (classSubject.parentClass == concernedClassSubject.parentClass && classSubject.parentSubject == concernedClassSubject.parentSubject) {
                return false;
            }

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
                + ` (${info.classInstance.name} & ${info.division.name}) ], `;
        });
        return displayString;
    }

    getSectionDisplayString(concernedOnlineClass: ParsedOnlineClass): string {
        const concernedClassSubject = this.vm.backendData.getClassSubjectById(concernedOnlineClass.parentClassSubject);

        const divisionIdSet = new Set<number>();

        this.vm.backendData.onlineClassList.forEach(onlineClass => {
            const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
            if (classSubject.parentClass != concernedClassSubject.parentClass || classSubject.parentSubject != concernedClassSubject.parentSubject)
                return;
            if (concernedOnlineClass.day == onlineClass.day
                && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                divisionIdSet.add(classSubject.parentDivision);
            }
        });

        const sectionList: Array<Division> = Array.from(divisionIdSet).map(divisionId => this.vm.backendData.getDivisionById(divisionId));
        sectionList.sort((a, b) => a.name.localeCompare(b.name));
        const displayString = 'Section - ' + sectionList.map(section => section.name.substr(-1)).join(", ");    // assumption section has only one letter which is the last letter of the name
        return displayString;
    }

}
