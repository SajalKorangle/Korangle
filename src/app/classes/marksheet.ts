
export class Marks {
    dbId: number;
    marks: number;
    subjectName: string;
    subjectId: number;
}

export class Marksheet {

    studentDbId: number;
    marks: Marks[] = [];

    copy(marksheet: any) {
        this.studentDbId = marksheet.studentDbId;
        marksheet.marks.forEach(
            marks => {
                this.marks.push(marks);
            }
        );
    }

}