import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GradeRule, GradeRuleSet } from '../../../class/constants_3';
import { DesignReportCardCanvasAdapter } from '../../../pages/design-report-card/design-report-card.canvas.adapter';

@Component({
    selector: 'app-grade-rules-dialog',
    templateUrl: './grade-rules-dialog.component.html',
    styleUrls: ['./grade-rules-dialog.component.css'],
})
export class GradeRulesDialogComponent implements OnInit {
    ca: DesignReportCardCanvasAdapter;
    gradeRuleSetList: Array<GradeRuleSet>;

    constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
        this.ca = data.ca;
        this.gradeRuleSetList = this.ca.gradeRuleSetList;
    }

    ngOnInit() {}

    addNewGradeRule(gradeRuleSet: GradeRuleSet): void {
        gradeRuleSet.gradeRules.push(new GradeRule());
    }

    addNewGradeRuleSet(): void {
        this.gradeRuleSetList.push(new GradeRuleSet());
    }
}
