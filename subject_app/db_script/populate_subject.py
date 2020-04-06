
from subject_app.db_script.constants import initialize_subject_list

def populate_subject(apps, schema_editor):

    Subject = apps.get_model('subject_app', 'Subject')

    counter = 1
    for subject in initialize_subject_list:
        subject_object = Subject(name=subject['name'], orderNumber=counter, governmentSubject=subject['governmentSubject'])
        subject_object.save()
        counter += 1
