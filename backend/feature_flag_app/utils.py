from .models import FeatureFlag


def isFeatureFlagEnabled(featureFlag):
    featureFlagObj = FeatureFlag.objects.filter(name=featureFlag).first()

    if featureFlagObj:
        return featureFlagObj.enabled

    return False
