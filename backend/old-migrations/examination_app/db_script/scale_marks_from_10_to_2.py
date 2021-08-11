from django.db.models import F

def scale_marks_from_10_to_2(apps, schema_editor):
	StudentExtraSubField = apps.get_model('examination_app','StudentExtraSubField')
	StudentExtraSubField.objects.all().update(marksObtained = (F('marksObtained')*1.0)/5)