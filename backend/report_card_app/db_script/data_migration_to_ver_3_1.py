import json

def dataMigration(apps, schema_editor):

    ReportCardLayoutNew = apps.get_model('report_card_app', 'ReportCardLayoutNew')
    TestSecond = apps.get_model('examination_app', 'TestSecond')
    layouts = ReportCardLayoutNew.objects.all()

    for layout in layouts:
        content = json.loads(layout.content)
        for page in content:
            for layer in page['layers']:
                if (layer['LAYER_TYPE'] in ['TEXT', 'DATE', 'ATTENDANCE', 'GRADE', 'REMARK', 'MARKS', 'FORMULA', 'RESULT']):
                    layer['textAlign'] = 'left'
                    layer['textBaseline'] = 'top'
                    layer['maxWidth'] = 200
                    if (layer['LAYER_TYPE'] == 'MARKS'):
                        outOf = 100
                        if (layer['parentExamination'] and layer['parentSubject'] and layer['testType'] and layer['marksType']):
                            testFilter = TestSecond.objects.filter(parentExamination=layer['parentExamination'], parentSubject=layer['parentSubject'], testType=layer['testType'])
                            if (len(testFilter) > 0):
                                outOf = testFilter.first().maximumMarks
                        outOf *= layer['factor']
                        layer['outOf'] = outOf
                        del layer['factor']

                elif (layer['LAYER_TYPE'] == 'TABLE'):
                    strokeStyle = layer['tableStyle']['strokeStyle']
                    lineWidth = layer['tableStyle']['lineWidth']
                    del layer['tableStyle']
                    rowCount = len(layer['rowsList'])
                    columnCount = len(layer['columnsList'])
                    cells = []
                    for row in range(rowCount):
                        rowCells = []
                        for cell in range(columnCount):
                            cellDict = {
                                'topBorder': {
                                    'visible': True,
                                    'lineWidth': lineWidth,
                                    'strokeStyle': strokeStyle,
                                },
                                'bottomBorder': {
                                    'visible': True,
                                    'lineWidth': lineWidth,
                                    'strokeStyle': strokeStyle,
                                },
                                'leftBorder': {
                                    'visible': True,
                                    'lineWidth': lineWidth,
                                    'strokeStyle': strokeStyle,
                                },
                                'rightBorder': {
                                    'visible': True,
                                    'lineWidth': lineWidth,
                                    'strokeStyle': strokeStyle,
                                },
                                'cellBackground': '#ffffff',
                            }
                            rowCells.append(cellDict)
                        cells.append(rowCells)
                    layer['cells'] = cells
        layout.content = json.dumps(content)
        layout.save()            

