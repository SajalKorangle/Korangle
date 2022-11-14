def add_backtrack_feature_flag(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_object = FeatureFlag()
    feature_flag_object.name = "Backtrack Student"
    feature_flag_object.save()
