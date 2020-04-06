import { Component, OnInit } from '@angular/core';
import {EmployeeOldService} from '../../../../services/modules/employee/employee-old.service';
import {EmployeeService} from '../../../../services/modules/employee/employee.service';
import {DataStorage} from '../../../../classes/data-storage';
import {DeleteEmployeeServiceAdapter} from './delete-employee.service.adapter';

@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.css'],
  providers: [ EmployeeOldService, EmployeeService ],
})
export class DeleteEmployeeComponent implements OnInit {

  user;

  isLoading = false;
  selectedEmployee = null;
  serviceAdapter: DeleteEmployeeServiceAdapter;

  constructor (public employeeOldService: EmployeeOldService,
               public employeeService: EmployeeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new DeleteEmployeeServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  enableDelete(){
    return true;
  }
}
