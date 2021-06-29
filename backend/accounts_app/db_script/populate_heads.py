
def populate_heads(apps, schema_editor):

    Module = apps.get_model('accounts_app', 'Heads')
    Module.objects.create(title = 'Expenses')
    Module.objects.create(title = 'Income')
    Module.objects.create(title = 'Assets')
    Module.objects.create(title = 'Liabilities')