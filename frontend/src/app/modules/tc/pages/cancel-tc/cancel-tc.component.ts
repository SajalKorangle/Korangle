import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { CancelTCServiceAdapter } from './cancle-tc.service.adapter';
import { TCService } from './../../../../services/modules/tc/tc.service';
import { StudentService} from './../../../../services/modules/student/student.service';

@Component({
  selector: 'app-cancel-tc',
  templateUrl: './cancel-tc.component.html',
  styleUrls: ['./cancel-tc.component.css'],
  providers: [
    TCService,
    StudentService
  ]
})
export class CancelTCComponent implements OnInit {

  user: any;

  serviceAdapter: CancelTCServiceAdapter;

  isLoading = false;


  constructor(public tcServic: TCService, public studentService: StudentService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new CancelTCServiceAdapter(this);
  }

}
