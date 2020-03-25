import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SetRollnumberServiceAdapter} from './set-rollnumber.service.adapter';
import {ClassService} from '../../../../services/modules/class/class.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import {DataStorage} from '../../../../classes/data-storage';

@Component({
  selector: 'app-set-rollnumber',
  templateUrl: './set-rollnumber.component.html',
  styleUrls: ['./set-rollnumber.component.css'],
  providers: [ ClassService, StudentService ],
})
export class SetRollnumberComponent implements OnInit {

  user;

  classSectionList = [];
  selectedClassSection: any;
  classTeacherSignature: any;

  serviceAdapter: SetRollnumberServiceAdapter;

  showSignature = false;
  isInitialLoading = false;
  isLoading = false;
  timeout: any;

  constructor(public classService: ClassService,
              public studentService: StudentService,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();

    this.serviceAdapter = new SetRollnumberServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  detectChanges(): void {
    this.cdRef.detectChanges();
  }

}
