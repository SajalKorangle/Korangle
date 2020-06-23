import * as jsPDF from 'jspdf'
import {FIELDS} from './constants'

export default class IdCard{
    pdf: any
    layout: any
    data: any
    printMultiple: any
    cols = 3
    rows = 3
    height: any
    width: any

    cardWidth = 85.60
    cardHeight = 53.98

    constructor (multiple, layout, data) {
        this.printMultiple = multiple
        this.layout = layout
        if(multiple){
            this.width = 297
            this.height = 210
        }else{
            this.height = 53.98
            this.width = 85.60
        }
        this.data = data
    }

    async fetchImage (url) {
        if (url) {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.onload = () => {
                    console.log('loaded')
                    return resolve(img)
                }
                img.onerror = () => resolve(null)
                img.src = url
            })
        }
        return null
    }

    async generate () {
        this.pdf = new jsPDF({orientation: 'l', unit: 'mm', format: this.printMultiple?'a4':'credit-card'})
        if (this.printMultiple) {
            const bucketedStudents = this.getBucketedStudentList()
            for (const [i, bucket] of bucketedStudents.entries()){
                if(i)this.pdf.addPage('a4', 'l')
                for (const [j, student] of bucket.entries()){
                    let tempx = (j%this.cols)*(this.width/this.cols)
                    let tempy = Math.floor((j/this.cols)%(this.rows))*(this.height/this.rows)
                    await this.createIDCard(tempx, tempy, student)
                }
            }
        }else{
            for (const [i, student] of this.data.studentList.entries()) {
                if (i) this.pdf.addPage('credit-card', 'l')
                await this.createIDCard(0, 0, student)
            }
            
        }
    }

    getField = key => FIELDS.find(x => x.key===key)

    async createIDCard (xbase, ybase, student) {
        const background = await this.fetchImage(this.layout.background?this.layout.background:'assets/img/id-card.jpeg')
        this.pdf.addImage(background, 'JPEG', xbase, ybase, this.cardWidth, this.cardHeight)
        for (let item of this.layout.content){
            if (this.getField(item.key).type==='text'){
                // Coversion for mm to jspdf pt
                let fontSize = item.fontSize*72/25.4
                this.pdf.setFontSize(fontSize)
                if(item.bold&&item.italic){
                    this.pdf.setFontType("bolditalic")
                }else if(item.bold){
                    this.pdf.setFontType("bold")
                }else if(item.italic){
                    this.pdf.setFontType("italic")
                }
                if(item.underline){
                    const textWidth = this.pdf.getTextWidth('Some text')
                    this.pdf.line(xbase+item.x, ybase+item.y, item.x+textWidth, item.y)
                }
                this.pdf.text(String(this.getField(item.key).get(this.data, student.id)), xbase+item.x, ybase+item.y, {baseline: 'top'})
            }else if(this.getField(item.key).type==="image"){
                const img = await this.fetchImage(this.getField(item.key).get(this.data, student.id))
                this.pdf.addImage(img, 'JPEG', xbase+item.x, ybase+item.y, item.width, item.height)
            }
        }
    }

    getBucketedStudentList () {
        let bucketedList = []
        let i = 0
        let temp = []
        while (i<this.data.studentList.length) {
            temp.push(this.data.studentList[i])
            i++
            if (i%(this.rows*this.cols)===0) {
                bucketedList.push(temp)
                temp = []
            }
        }
        if (i%(this.rows*this.cols)) bucketedList.push(temp)
        console.log(bucketedList)
        return bucketedList
    }

    download = () => {
        this.pdf.save('id-card.pdf')
    }
}