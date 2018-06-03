import { Component, Input, OnInit } from '@angular/core';

import { FeeService } from '../../fee.service';
import { TeamService } from '../../../team/team.service';

import { Concession } from '../../classes/common-functionalities';

@Component({
  selector: 'app-total-discount',
  templateUrl: './total-discount.component.html',
  styleUrls: ['./total-discount.component.css'],
    providers: [FeeService, TeamService]
})
export class TotalDiscountComponent implements OnInit {

    @Input() user;

    startDate = this.todaysDate();
    endDate = this.todaysDate();

    concessionList: any;
    filteredConcessionList: any;

    selectedMember: any;
    memberList = [];

    isLoading = false;

    todaysDate(): string {
        const d = new Date();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return year + '-' + month + '-' + day;
    }

    constructor(private feeService: FeeService,
                private teamService: TeamService) { }

    ngOnInit(): void {
        let data = {
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.teamService.getSchoolMemberList(data, this.user.jwt).then(memberList => {
            this.memberList = memberList;
            let member = {
                username: 'All',
            };
            this.memberList.push(member);
            this.selectedMember = member;
        });
    }

    getSchoolConcessionList(): void {
        const data = {
            startDate: this.startDate,
            endDate: this.endDate,
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.isLoading = true;
        this.concessionList = null;
        this.feeService.getSchoolConcessionList(data, this.user.jwt).then(concessionList => {
            this.isLoading = false;
            this.concessionList = concessionList;
            this.populateFilteredConcessionList();
            console.log(this.concessionList);
        }, error => {
            this.isLoading = false;
        });
    }

    populateFilteredConcessionList(): void {

        if (!this.concessionList) {
            return;
        }

        if (!this.selectedMember || this.selectedMember.username === 'All') {
            this.filteredConcessionList = this.concessionList;
            return;
        }

        this.filteredConcessionList = this.concessionList.filter(concession => {
            if (concession.parentReceiver === this.selectedMember.userDbId) {
                return true;
            } else {
                return false;
            }
        });

    }

    getSchoolConcessionListTotalAmount(): number {
        return Concession.getConcessionListTotalAmount(this.concessionList);
    }

}
