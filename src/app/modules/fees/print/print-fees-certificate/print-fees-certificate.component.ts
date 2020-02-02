import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MEDIUM_LIST} from '../../../../classes/constants/medium';
import {PrintService} from '../../../../print/print-service';
import {INSTALLMENT_LIST} from "../../classes/constants";

@Component({
  selector: 'app-print-fees-certificate',
  templateUrl: './print-fees-certificate.component.html',
  styleUrls: ['./print-fees-certificate.component.css']
})
export class PrintFeesCertificateComponent implements OnInit {

  user: any;

  mediumList = MEDIUM_LIST;
  installmentList = INSTALLMENT_LIST;

  certificateNumber: any;
  boardList = [];
  studentList = [];
  studentSectionList = [];
  classList = [];
  sectionList = [];
  feeTypeList = [];
  subFeeReceiptList = [];
  feeReceiptList = [];
  selectedSession: any;

  viewChecked = true;

  constructor(private cdRef: ChangeDetectorRef, private printService: PrintService) { }

  ngOnInit(): void {
    const {user, value} = this.printService.getData();
    this.user = user;
    console.log(value);
    this.certificateNumber = value.certificateNumber;
    this.studentList = value.studentList;
    this.boardList = value.boardList;
    this.selectedSession = value.selectedSession;
    this.subFeeReceiptList = value.subFeeReceiptList;
    this.feeReceiptList = value.feeReceiptList;
    this.feeTypeList = value.feeTypeList;
    this.classList = value.classList;
    this.sectionList = value.sectionList;
    this.studentSectionList = value.studentSectionList;
    this.viewChecked = false;
  }

    getCurrentDate(){
        return new Date();
    }

    getClassAndSectionName(student: any): any {
        let classs = this.classList.find(classs => {
            return classs.dbId == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == student.id;
            }).parentClass;
        });
        let section = this.sectionList.find(section => {
            return section.id == this.studentSectionList.find(studentSection => {
                return studentSection.parentStudent == student.id;
            }).parentDivision;
        });
        return classs.name+', '+section.name;
    }

    getFeesPaidByFeeTypeAndStudent(feeType: any, student: any):number {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return subFeeReceipt.parentFeeType == feeType.id
                && student.id == this.feeReceiptList.find(feeReceipt => {
                    return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
                }).parentStudent;
        }).reduce((totalAmount, subFeeReceipt) => {
            return totalAmount + this.getSubFeeReceiptTotalAmount(subFeeReceipt);
        }, 0);
    }

    getFilteredFeesTypeList(student: any): any {
        return this.feeTypeList.filter(feeType => {
            return this.getFeesPaidByFeeTypeAndStudent(feeType, student) > 0;
        });
    }

    getTotalFeesPaidByStudent(student: any):number {
        return this.subFeeReceiptList.filter(subFeeReceipt => {
            return student.id == this.feeReceiptList.find(feeReceipt => {
                return subFeeReceipt.parentFeeReceipt == feeReceipt.id;
            }).parentStudent;
        }).reduce((totalAmount, subFeeReceipt) => {
            return totalAmount + this.getSubFeeReceiptTotalAmount(subFeeReceipt);
        }, 0);
    }

    getTotalFeesPaid(): number {
        return this.studentList.reduce((totalAmount, student) => {
            return totalAmount + this.getTotalFeesPaidByStudent(student);
        },0);
    }

    getSubFeeReceiptTotalAmount(subFeeReceipt: any): number {
        return this.installmentList.reduce((totalAmount, installment) => {
            return totalAmount
                + (subFeeReceipt[installment+'Amount']?subFeeReceipt[installment+'Amount']:0)
                + (subFeeReceipt[installment+'LateFee']?subFeeReceipt[installment+'LateFee']:0);
        }, 0);
    }

    /*getTotalFees(student){
        return student.Admission_Fee + student.Vehicle_Fee + student.Tution_Fee + student.Fine;
  }

  numberToEnglish(n, custom_join_character) {

    var string = n.toString(),
        units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words;

    var and = custom_join_character || 'and';

    if (parseInt(string) === 0) {
      return 'zero';
    }

    units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];

    start = string.length;
    chunks = [];
    while (start > 0) {
      end = start;
      chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    chunksLen = chunks.length;
    if (chunksLen > scales.length) {
      return '';
    }

    words = [];
    for (i = 0; i < chunksLen; i++) {

      chunk = parseInt(chunks[i]);

      if (chunk) {

        ints = chunks[i].split('').reverse().map(parseFloat);

        if (ints[1] === 1) {
          ints[0] += 10;
        }

        if ((word = scales[i])) {
          words.push(word);
        }

        if ((word = units[ints[0]])) {
          words.push(word);
        }

        if ((word = tens[ints[1]])) {
          words.push(word);
        }

        if (ints[0] || ints[1]) {

          if (ints[2] || !i && chunksLen) {
            words.push(and);
          }

        }

        if ((word = units[ints[2]])) {
          words.push(word + ' hundred');
        }

      }

    }

    return words.reverse().join(' ');

  }*/

  ngAfterViewChecked(): void {
    if (this.viewChecked === false) {
      this.viewChecked = true;
      this.printService.print();
      this.studentList = [];
      this.cdRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
      this.studentList = [];
  }

}
