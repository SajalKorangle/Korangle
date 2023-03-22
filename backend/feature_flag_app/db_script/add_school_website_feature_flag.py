from feature_flag_app.constants.feature_flags import SCHOOL_WEBSITE_FEATURE_FLAG


def add_school_website_feature_flag(apps, schema_editor):
    FeatureFlag = apps.get_model('feature_flag_app', 'FeatureFlag')

    feature_flag_object = FeatureFlag()
    feature_flag_object.name = SCHOOL_WEBSITE_FEATURE_FLAG
    feature_flag_object.save()
