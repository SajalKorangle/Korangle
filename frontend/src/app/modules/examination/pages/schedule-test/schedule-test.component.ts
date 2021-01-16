import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'app/services/modules/subject/subject.service';
import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';
import { DataStorage } from '../../../../classes/data-storage';
import { ClassService } from '../../../../services/modules/class/class.service';
import { ExaminationService } from '../../../../services/modules/examination/examination.service';
import { ScheduleTestServiceAdapter } from './schedule-test.service.adapter';

@Component({
	selector: 'schedule-test',
	templateUrl: './schedule-test.component.html',
	styleUrls: ['./schedule-test.component.css'],
	providers: [
		ClassService,
		ExaminationService,
		SubjectService,
	],
})
export class ScheduleTestComponent implements OnInit {
	showSelectedClassAndSection: any = [];
	selectedExaminationNew: any;

	newTestList: Array<{
		deleted: boolean;
		parentExamination: any;
		subjectId: any;
		subjectName: any;
		testType: any;
		maximumMarks: any;
		startTime: any;
		newStartTime: any;
		endTime: any;
		newEndTime: any;
		date: any;
		newDate: any;
		classList: Array<{
			classId: any;
			className: any;
			sectionList: Array<{
				sectionId: any;
				sectionName: any;
				testId: any;
			}>;
		}>;
	}>;

	classSectionSubjectList: Array<{
		className: any;
		classId: any;
		sectionList: Array<{
			sectionName: any;
			sectionId: any;
			selected: boolean;
			subjectList: Array<{
				subjectName: any;
				subjectId: any;
			}>;
		}>;
	}>;



	isUpdated = false;

	user;

	showTestDetails = false;

	selectedExamination: any = undefined;

	dataCanBeFetched = true;

	fetchedListLength: any;

	subjectList: any;

	testTypeList = TEST_TYPE_LIST;

	examinationList: any = [];

	serviceAdapter: ScheduleTestServiceAdapter;

	isInitialLoading = false;

	isLoading = false;

	constructor(
		public examinationService: ExaminationService,
		public classService: ClassService,
		public subjectNewService: SubjectService
	) { }

	ngOnInit(): void {
		this.user = DataStorage.getInstance().getUser();

		this.serviceAdapter = new ScheduleTestServiceAdapter();
		this.serviceAdapter.initializeAdapter(this);
		this.serviceAdapter.initializeData();
	}

	formatDate(dateStr: any, status: any): any {
		let d = new Date(dateStr);

		if (status === 'firstDate') {
			d = new Date(d.getFullYear(), d.getMonth(), 1);
		} else if (status === 'lastDate') {
			d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
		}

		let month = '' + (d.getMonth() + 1);
		let day = '' + d.getDate();
		let year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}

	getTestDate(test: any): any {
		return new Date(test.startTime);
	}

	onTestDateUpdation(test: any, event: any): void {
		var tempNewDate = this.formatDate(event.value, '');
		var tempOldDate = this.formatDate(test.date, '');
		if (tempNewDate != tempOldDate) {
			test.newDate = event.value;
		}
		else {
			test.newDate = test.date;
		}
		this.handleUpdate();

	}




	//It handles the update button
	handleUpdate(): void {
		var update = false;
		this.newTestList.forEach((test) => {
			if (this.formatDate(test.newDate, '') != this.formatDate(test.date, '')
				|| test.newStartTime != test.startTime
				|| test.newEndTime != test.endTime
				|| test.deleted) {
				update = true;
			}


		});
		if (update) this.isUpdated = true;
		else this.isUpdated = false;


	}

	//Check if current test is created for all the selected class and section
	containsAllClass(test: any): boolean {
		var containsAll = true;

		this.showSelectedClassAndSection.forEach((item) => {
			var cl = item.className;
			var sec = item.sectionName;
			var clFound = false;
			test.classList.forEach((clas) => {
				if (clas.className === cl) {
					clFound = true;
					var secIndex = clas.sectionList.findIndex(
						(secc) => secc.sectionName === sec
					);
					if (secIndex === -1) containsAll = false;
				}
			});
			if (!clFound) containsAll = false;
		});

		return containsAll;
	}

	//Reset the test list view if not updated or simply get the backend test list
	resetList(): void {
		this.serviceAdapter.getTestAndSubjectDetails();
		this.isUpdated = false;
	}
}
