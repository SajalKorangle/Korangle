import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataStorage} from '../../../../classes/data-storage';
import {UpdateAllServiceAdapter} from './update-all.service.adapter';
import {EmployeeService} from '../../../../services/modules/employee/employee.service';

class ColumnHandle {
  name: any;
  key: any;
  inputType: string;
  show: boolean;
  list: any;

  constructor(name, key, inputType, show, list) {
    this.name = name;
    this.key = key;
    this.inputType = inputType;
    this.show = show;
    this.list = list;
  }
}

const GENDER_LIST = [
  'Male',
  'Female',
  'Other',
];

@Component({
  selector: 'app-update-all',
  templateUrl: './update-all.component.html',
  styleUrls: ['./update-all.component.css'],
  providers: [EmployeeService]
})
export class UpdateAllComponent implements OnInit {

  user;
  employeeFullProfileList = [];

  COLUMNHANDLES: ColumnHandle[] = [
    // value, key, inputType, show, selectedList
    new ColumnHandle('S No.', 'serialNumber', null, true, ''), // 1
    new ColumnHandle('Name', 'name', 'text', true, ''), // 2
    new ColumnHandle('Employee No.', 'employeeNumber', 'text', false, ''), // 3
    new ColumnHandle('Father\'s Name', 'fatherName', 'text', true, ''), // 4
    new ColumnHandle('Spouse\'s Name', 'spouseName', 'text', false, ''), // 5
    new ColumnHandle('Mobile No.', 'mobileNumber', 'number', true, ''), // 6
    new ColumnHandle('Date of Birth', 'dateOfBirth', 'date', false, ''), // 7
    new ColumnHandle('Mother\'s Name', 'motherName', 'text', false, ''), // 8
    new ColumnHandle('Aadhar No.', 'aadharNumber', 'number', false, ''), // 9
    new ColumnHandle('Passport No.', 'passportNumber', 'number', false, ''), // 10
    new ColumnHandle('Qualification', 'qualification', 'number', false, ''), // 11
    new ColumnHandle('Current Post', 'currentPost', 'text', false, ''), // 12
    new ColumnHandle('Date Of Joining', 'dateOfJoining', 'date', false, ''), // 13
    new ColumnHandle('Pan No.', 'panNumber', 'number', false, ''), // 14
    new ColumnHandle('Gender', 'gender', 'list', false, GENDER_LIST), // 15
    new ColumnHandle('Address', 'address', 'text', false, ''), // 16
    new ColumnHandle('Bank Name', 'bankName', 'text', false, ''), // 17
    new ColumnHandle('Bank Acc. No.', 'bankAccountNumber', 'text', false, ''), // 18
    new ColumnHandle('Epf Acc. No.', 'epfAccountNumber', 'number', false, ''), // 19
    new ColumnHandle('Bank IFSC Code', 'bankIfscCode', 'text', false, ''), // 20
    new ColumnHandle('Month Salary', 'monthlySalary', 'text', false, ''), // 21
    new ColumnHandle('Pran No.', 'pranNumber', 'text', false, ''), // 22
    new ColumnHandle('Remark', 'remark', 'text', false, ''), // 23
  ];

  serviceAdapter: UpdateAllServiceAdapter;

  isLoading = false;

  constructor(public employeeService:EmployeeService,
              public cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();

    this.serviceAdapter = new UpdateAllServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }
  showAllColumns(): void {
    this.COLUMNHANDLES.forEach(item => {
      item.show = true;
    });
  }

  hideAllColumns(): void {
    this.COLUMNHANDLES.forEach(item => {
      item.show = false;
    });
  }


}
