import * as jsPDF from 'jspdf'
import {PARAMETER_LIST, DATA_TYPES, FIELDS, UserHandleStructure} from './constants'

//// data variable contains following :-
//// school
//// studentList
//// studentSectionList
//// studentParameterList
//// studentParameterValueList
//// classList
//// divisionList
//// sessionList

export default class ReportCard {
    pdf: any;
    layout: any;
    data: any;
    printMultiple: any;
    cols = 3;
    rows = 3;
    height: any;
    width: any;

    // cardWidth = 86.60; // Adding 1mm to 85.60 to give cutting space.
    // cardHeight = 54.98; // Adding 1mm to 53.98 to give cutting space.

    cardWidth = 210; // Adding 1mm to 85.60 to give cutting space.
    cardHeight = 297; // Adding 1mm to 53.98 to give cutting space.

    mmToPoint = 72 / 25.4;

    constructor (multiple, layout, data) {
        this.printMultiple = multiple;
        this.layout = layout;
        if (multiple) {
            this.width = 297;
            this.height = 210;
        } else {
            this.height = this.cardHeight;
            this.width = this.cardWidth;
        }
        this.data = data;
    }

    async fetchImage (url) {
        if (url) {
            // TODO: Add crossorigin="anonymous" to every request so that header comes from Shitty AWS servers
            // https://bugs.chromium.org/p/chromium/issues/detail?id=158131
            // https://forums.aws.amazon.com/thread.jspa?threadID=106157
            if (url.search(/data.*base64,/) === -1) {
                url += '?javascript=';
            }
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    return resolve(img)
                };
                img.onerror = () => {
                    console.error('Error loading image');
                    resolve(null);
                };
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = url;
            })
        }
        return null
    }

    async fetchFont(url) {
        if (url) {
            // TODO: Add crossorigin="anonymous" to every request so that header comes from Shitty AWS servers
            // https://bugs.chromium.org/p/chromium/issues/detail?id=158131
            // https://forums.aws.amazon.com/thread.jspa?threadID=106157
            // url += '?javascript=';
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        // The request is done; did it work?
                        if (xhr.status === 200) {

                            const reader = new FileReader();
                            reader.onload = function (event) {
                                resolve(reader.result.toString().replace(/data.*base64,/, ''));
                            };
                            reader.readAsDataURL(xhr.response);
                        } else {
                            // ***No, tell the callback the call failed***
                            resolve(null);
                        }
                    }
                };
                xhr.responseType = 'blob';
                xhr.open('GET', url);
                xhr.send();
            });
        }
        return null;
    }

    async handleFonts() {
        const alreadyDownloadedList = [];
        const defaultBase64Content = await this.fetchFont('https://korangleplus.s3.amazonaws.com/' +
            encodeURIComponent('assets/fonts/Arial/Arial-Normal.ttf'));
        // If this error 'jsPDF PubSub Error No unicode cmap for font Error: No unicode cmap for font' shows up
        // Try printing following statement to see whether you have parsed correctly.
        // console.log(defaultBase64Content);
        this.pdf.addFileToVFS('Arial-Normal.ttf', defaultBase64Content);
        this.pdf.addFont('Arial-Normal.ttf', 'Arial', 'Normal');
        alreadyDownloadedList.push({
            fontFamily: 'Arial',
            fontStyle: 'Normal',
        });
        for (const item of this.layout.content) {
            if (item.fontFamily && item.fontStyle && alreadyDownloadedList.find(alreadyDownloaded => {
                return alreadyDownloaded.fontFamily === item.fontFamily
                    && alreadyDownloaded.fontStyle === item.fontStyle;
            }) === undefined) {
                const fontFileName = item.fontFamily + '-' + item.fontStyle + '.ttf';
                const Base64Content = await this.fetchFont(
                    'https://korangleplus.s3.amazonaws.com/' +
                    encodeURIComponent('assets/fonts/' + item.fontFamily + '/' + fontFileName));
                this.pdf.addFileToVFS(fontFileName, Base64Content);
                this.pdf.addFont(fontFileName, item.fontFamily, item.fontStyle);
                alreadyDownloadedList.push({
                    fontFamily: item.fontFamily,
                    fontStyle: item.fontStyle
                });
            }
        }
    }

    async generate () {
        // this.pdf = new jsPDF({orientation: 'l', unit: 'mm', format: this.printMultiple ? 'a4' : 'credit-card'});
        this.pdf = new jsPDF({orientation: 'p', unit: 'mm', format: [this.height * this.mmToPoint, this.width * this.mmToPoint]});
        await this.handleFonts();
        if (this.printMultiple) { // This if will be scrapped as there are no multiple report cards in a single page
            const bucketedStudents = this.getBucketedStudentList();
            for (const [i, bucket] of bucketedStudents.entries()) {
                if (i) {
                    // this.pdf.addPage('a4', 'l');
                    this.pdf.addPage([this.height * this.mmToPoint, this.width * this.mmToPoint], 'p');
                }
                for (const [j, student] of bucket.entries()) {
                    const tempx = (j % this.cols) * (this.width / this.cols) + 5;
                    const tempy = Math.floor((j / this.cols) % (this.rows)) * (this.height / this.rows) + 5;
                    await this.createIDCard(tempx, tempy, student)
                }
            }
        } else { // For 1 id card in standard id card size sheet
            for (const [i, student] of this.data.studentList.entries()) {
                if (i) {
                    // this.pdf.addPage('credit-card', 'l');
                    // this.pdf.addPage([this.height * this.mmToPoint, this.width * this.mmToPoint], 'p');
                    this.pdf.addPage([this.height * this.mmToPoint, this.width * this.mmToPoint], 'p');
                }
                await this.createIDCard(0, 0, student)
            }
        }
    }

    getParameter(key: any): any {
        return PARAMETER_LIST.find(x => x.key === key);
    }

    async createIDCard (xbase, ybase, student) {
        const background = await this.fetchImage(this.layout.background);
        this.pdf.addImage(background, 'JPEG', xbase, ybase, this.cardWidth, this.cardHeight);
        for (const userHandle of this.layout.content) {

            const item = {...UserHandleStructure.getStructure( '', this.getParameter(userHandle.key).dataType, true), ...userHandle};

            if (this.getParameter(item.key).dataType === DATA_TYPES.TEXT
                || this.getParameter(item.key).dataType === DATA_TYPES.MARKS
                || this.getParameter(item.key).dataType === DATA_TYPES.DATE) {

                // Font Size
                // Coversion for mm to jspdf pt
                const fontSize = item.fontSize * this.mmToPoint;
                this.pdf.setFontSize(fontSize);

                // Font Family, Font Style
                this.pdf.setFont(item.fontFamily, item.fontStyle);

                // Text Color
                this.pdf.setTextColor(item.textColor);

                // Underline
                const text = String(this.getParameter(item.key).getValueFunc({data: this.data, studentId: student.id, userHandle: item, userHandleList: this.layout.content}));
                let textWidth = this.pdf.getTextWidth(text) + 0.01;
                textWidth = item.maxWidth > 0 && textWidth > item.maxWidth ? item.maxWidth : textWidth;
                const textArray = this.pdf.splitTextToSize(text, textWidth);
                if (item.underline) {
                    const lineHeight = this.pdf.getLineHeightFactor() * item.fontSize * textArray.length;
                    this.pdf.line(
                        xbase + item.x,
                        ybase + item.y + lineHeight,
                        xbase + item.x + textWidth,
                        ybase + item.y + lineHeight
                    );
                }

                // Populate text in pdf
                this.pdf.text(
                    text,
                    xbase + item.x,
                    ybase + item.y,
                    {
                        baseline: item.baseline,
                        align: item.align,
                        maxWidth: item.maxWidth
                    }
                );
            } else if (this.getParameter(item.key).dataType === DATA_TYPES.IMAGE) {
                const img = await this.fetchImage(this.getParameter(item.key).getValueFunc({data: this.data, studentId: student.id, userHandleList: this.layout.content}));
                if (img) {
                    this.pdf.addImage(img, 'JPEG', xbase + item.x, ybase + item.y, item.width, item.height);
                }
            } else if (this.getParameter(item.key).dataType === DATA_TYPES.TABLE) {

                // this.pdf.setDrawColor(item.drawColor);

                let startingX, startingY;

                startingY = item.y;
                for (let i = 0; i < item.cellList.length; i++) {
                    startingX = item.x;
                    for (let j = 0; j < item.cellList[i].length; j++) {
                        if (item.cellList[i][j]) {
                            console.log(item.cellList[i][j]);
                            this.pdf.setFillColor(item.cellList[i][j]);
                            this.pdf.rect(startingX, startingY, item.columnList[j].length, item.rowList[i].length, 'F');
                        }
                        startingX += item.columnList[j].length;
                    }
                    startingY += item.rowList[i].length;
                }

                // Draw lines
                // Horizontal
                startingY = item.y;
                for (let i = 0; i <= item.rowList.length; i++) {
                    startingX = item.x;
                    for (let j = 0; j < item.columnList.length; j++) {
                        if (item.horizontalLineList[i][j].color) {
                            this.pdf.setDrawColor(item.horizontalLineList[i][j].color);
                            this.pdf.setLineWidth(item.horizontalLineList[i][j].width);
                            this.pdf.line(
                                startingX - this.getCorrectionForLineWidth(item.verticalLineList, i, j, item.rowList.length - 1),
                                startingY,
                                startingX + item.columnList[j].length + this.getCorrectionForLineWidth(item.verticalLineList, i, j + 1, item.rowList.length - 1),
                                startingY);
                        }
                        startingX += item.columnList[j].length;
                    }
                    startingY += (i < item.rowList.length ? item.rowList[i].length : 0);
                }

                // Vertical
                startingY = item.y;
                for (let i = 0; i < item.rowList.length; i++) {
                    startingX = item.x;
                    for (let j = 0; j <= item.columnList.length; j++) {
                        if (item.verticalLineList[j][i].color) {
                            this.pdf.setDrawColor(item.verticalLineList[j][i].color);
                            this.pdf.setLineWidth(item.verticalLineList[j][i].width);
                            this.pdf.line(
                                startingX,
                                startingY - this.getCorrectionForLineWidth(item.horizontalLineList, j, i, item.columnList.length - 1),
                                startingX,
                                startingY + item.rowList[i].length + this.getCorrectionForLineWidth(item.horizontalLineList, j, i + 1, item.columnList.length - 1));
                        }
                        startingX += (j < item.columnList.length ? item.columnList[j].length : 0);
                    }
                    startingY += item.rowList[i].length;
                }

            }
        }
    }

    getBucketedStudentList () {
        const bucketedList = [];
        let i = 0;
        let temp = [];
        while (i < this.data.studentList.length) {
            temp.push(this.data.studentList[i]);
            i++;
            if (i % (this.rows * this.cols) === 0) {
                bucketedList.push(temp);
                temp = [];
            }
        }
        if (i % (this.rows * this.cols)) {
            bucketedList.push(temp);
        }
        return bucketedList;
    }

    download(): void {
        this.pdf.save('id-card.pdf')
    }

    getCorrectionForLineWidth(list: any, i: any, j: any, maxI: any): any {
        if ( i - 1 < 0 ) {
            return list[j][i].width / 2;
        } else if ( i > maxI) {
            return list[j][i - 1].width / 2;
        } else {
            return list[j][i].width / 2;
            const first = list[j][i].width / 2;
            const second = list[j][i - 1].width / 2;
            return first > second ? first : second;
        }
    }

}
