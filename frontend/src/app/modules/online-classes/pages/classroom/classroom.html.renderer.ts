import { ClassroomComponent } from './classroom.component';
import { TimeSpan, TimeComparator, TimeSpanComparator, Time, ColorPaletteHandle, ParsedOnlineClass } from '@modules/online-classes/class/constants';
export class ClassroomHtmlRenderer {

    vm: ClassroomComponent;

    timeTableMatrx: Array<Array<ParsedOnlineClass>>;    // columns contains timetabe for one day

    colorPaletteHandle = ColorPaletteHandle;

    hasAtleastOneClass = false;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    initilizeTimeTable() {
        ColorPaletteHandle.reset();

        this.timeTableMatrx = [];

        Object.values(this.vm.weekdays).forEach(weekday => {
            const weekdayFilteredOnlineClassList = this.vm.backendData.onlineClassList
                .filter(onlineClass => onlineClass.day == weekday);
            weekdayFilteredOnlineClassList.sort((onlineclass1, onlineClass2) => TimeComparator(onlineclass1.startTimeJSON, onlineClass2.startTimeJSON));
            this.timeTableMatrx.push(weekdayFilteredOnlineClassList);
            if (weekdayFilteredOnlineClassList.length > 0) {
                this.hasAtleastOneClass = true;
            }
        });
        this.timeTableMatrx = Object.values(this.vm.weekdays).map((col1, i) => this.timeTableMatrx.map(row => row[i]));  // transpose
        console.log('timetable = ', this.timeTableMatrx);
    }

    getTime() {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });
        return customTime.getDisplayString();
    }

    getOnlineClassByWeekDayAndStartTime(weekdayKey, time: Time) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeComparator(time, onlineClass.startTimeJSON) == 0)
                return true;
            return false;
        });
    }

    getDisplayData(onlineClass: ParsedOnlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        const classInstane = this.vm.backendData.getClassById(classSubject.parentClass);
        const division = this.vm.backendData.getDivisionById(classSubject.parentDivision);
        return { classSubject, subject, classInstane, division };
    }

    isActiveTime(time: Time): boolean {
        const activeClass = this.getActiveClass();
        if (!activeClass)
            return false;

        if (TimeComparator(activeClass.startTimeJSON, time) <= 0
            && TimeComparator(time, activeClass.endTimeJSON) < 0) {
            return true;
        }
        return false;
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
        return this.vm.backendData.onlineClassList.find(onlineClass => onlineClass.day == this.vm.today && this.isActive(onlineClass));
    }

}
