
initialize_subject_list = [
    'Mathematics',
    'Hindi',
    'English',
    'Environmental Science',
    'Drawing',
    'Conversational',
    'Computer',
    'Moral Science',
    'Science',
    'Social Science',
    'Sanskrit',
]


def populate_subject(apps, schema_editor):

    SubjectSecond = apps.get_model('subject_app', 'SubjectSecond')

    for subject_data in initialize_subject_list:
        subject = SubjectSecond(name=subject_data)
        subject.save()
