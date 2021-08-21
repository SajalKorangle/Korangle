

def populate_extra_field(apps, schema_editor):

    ExtraField = apps.get_model('subject_app', 'ExtraField')
    ExtraSubField = apps.get_model('subject_app', 'ExtraSubField')

    """"""

    extra_field_object = ExtraField(name='Co-Scholastic Areas')
    extra_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Literary')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Cultural')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Scientific')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Creativity')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Sports, Yoga, Scout/RedCross')
    extra_sub_field_object.save()

    """"""

    extra_field_object = ExtraField(name='Personal & Social Qualities')
    extra_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Regularity')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Punctuality')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Cleanliness')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Discipline/Dutifulness')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Helpfulness')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Environment Sensitive')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Leadership')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Truthfulness')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Honesty')
    extra_sub_field_object.save()

    extra_sub_field_object = ExtraSubField(parentExtraField=extra_field_object, name='Representation')
    extra_sub_field_object.save()

