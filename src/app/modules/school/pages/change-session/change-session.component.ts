import {Component, Input, EventEmitter, Output ,OnInit } from '@angular/core';

import { SchoolService } from '../../../../services/school.service';
import {TeamService} from "../../../team/team.service";
import {SESSION_LIST} from "../../../../classes/constants/session";


@Component({
  selector: 'change-session',
  templateUrl: './change-session.component.html',
  styleUrls: ['./change-session.component.css'],
    providers: [ SchoolService,TeamService ],
})

export class ChangeSessionComponent implements OnInit {

    @Input() user;
    @Output() permissionEmitter = new EventEmitter<boolean>();

    isLoading = false;
    sessionChangePermission=false;
    moduleList=[];

    constructor (private teamService: TeamService) { }

    ngOnInit() {
        console.log('change session is calledx');
        // const request_module_data = {
        //     schoolDbId: this.user.activeSchool.dbId,
        // };
        // this.isLoading = true;
        // Promise.all([
        //     this.teamService.getSchoolModuleList(request_module_data, this.user.jwt),
        // ]).then(value => {
        //     // console.log(value);
        //     this.isLoading = false;
        //     this.sessionChangePermission=true;
        //     this.moduleList=value[0];
        //     //no need for checkPermission??
        //     this.checkPermission(this.moduleList)
        // }, error => {
        //     console.log('error changing session');
        //     this.isLoading = false;
        // });
        //



    }
    //
    // checkPermission(moduleArray):void{
    //    moduleArray.forEach(module=>{
    //        if(module.path=="school"){
    //             let taskList=module.taskList;
    //             taskList.forEach(task=>{
    //                 if(task.path=="change_session"){
    //                         console.log('permission is granted!');
    //                        this.sessionChangePermission=true;
    //                         this.permissionEmitter.emit(this.sessionChangePermission);
    //                 }
    //             });
    //
    //        }
    //    });
    // }
    //

}
