def add_easebuzz_feature_flag(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_object = FeatureFlag()
    feature_flag_object.name = "Easebuzz Online Payment Gateway Feature Flag"
    feature_flag_object.save()
