import json

def dataMigration(apps, schema_editor):

    ReportCardLayoutNew = apps.get_model('report_card_app', 'ReportCardLayoutNew')
    layouts = ReportCardLayoutNew.objects.all()

    for layout in layouts:
        content = json.loads(layout.content)
        for page in content:
            for layer in page['layers']:
                if (layer['LAYER_TYPE'] == 'TEXT'):
                    layer['textAlign'] = 'left'
                    layer['textBaseline'] = 'top'
                    layer['maxWidth'] = 200
                elif (layer['LAYER_TYPE'] == 'TABLE'):
                    strokeStyle = layer['tableStyle']['strokeStyle']
                    lineWidth = layer['tableStyle']['lineWidth']
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

