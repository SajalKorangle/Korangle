def set_tc_school_fee_rule_to_zero(apps, schema_editor):
    SchoolFeeRule = apps.get_model('fees_third_app', 'SchoolFeeRule')
    tc_school_fee_rule_list = SchoolFeeRule.objects.filter(name='TC FEE(Software Generated)')
    for school_fee_rule in tc_school_fee_rule_list:
        school_fee_rule.aprilAmount = None
        school_fee_rule.isClassFilter = True
        school_fee_rule.save()