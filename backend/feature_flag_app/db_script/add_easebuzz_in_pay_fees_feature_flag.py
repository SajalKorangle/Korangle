def add_easebuzz_in_pay_fees_feature_flag(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_object = FeatureFlag()
    feature_flag_object.name = "Easebuzz in Pay Fees page feature flag"
    feature_flag_object.save()