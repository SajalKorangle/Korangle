def add_library_phase_2_feature_flag(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_object = FeatureFlag()
    feature_flag_object.name = "Library Phase 2 (Issue Deposit Book)"
    feature_flag_object.save()
