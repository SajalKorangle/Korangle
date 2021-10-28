def migrate_rc_layout_data(apps, schema_editor):
    ReportCardLayoutNew = apps.get_model('report_card_app', 'ReportCardLayoutNew')
    LayoutSharingReportCard = apps.get_model('report_card_app', 'LayoutSharing')
    RcImageAssets = apps.get_model('report_card_app', 'ImageAssets')

    Layout = apps.get_model('generic_design_app', 'Layout')
    LayoutShare = apps.get_model('generic_design_app', 'LayoutShare')
    ImageAssets = apps.get_model('generic_design_app', 'ImageAssets')

    for rc_layout in ReportCardLayoutNew.objects.all():
        newLayout = Layout.objects.create(
            type='REPORT CARD',
            parentSchool=rc_layout.parentSchool,
            name=rc_layout.name,
            thumbnail=rc_layout.thumbnail,
            publiclyShared=rc_layout.publiclyShared,
            content=rc_layout.content
        )

        for rc_layout_sharing in LayoutSharingReportCard.objects.filter(parentLayout=rc_layout):
            LayoutShare.objects.create(
                parentLayout=newLayout,
                parentSchoolSharedWith=rc_layout_sharing.parentSchool
            )

    for image_assets in RcImageAssets.objects.all():
        ImageAssets.objects.create(
            image=image_assets.image,
        )


def migrate_tc_layout_data(apps, schema_editor):
    TcLayout = apps.get_model('tc_app', 'TCLayout')
    LayoutSharingTc = apps.get_model('tc_app', 'TCLayoutSharing')
    TcImageAssets = apps.get_model('tc_app', 'TCImageAssets')

    Layout = apps.get_model('generic_design_app', 'Layout')
    LayoutShare = apps.get_model('generic_design_app', 'LayoutShare')
    ImageAssets = apps.get_model('generic_design_app', 'ImageAssets')

    for tc_layout in TcLayout.objects.all():
        newLayout = Layout.objects.create(
            type='TC',
            parentSchool=tc_layout.parentSchool,
            name=tc_layout.name,
            thumbnail=tc_layout.thumbnail,
            publiclyShared=tc_layout.publiclyShared,
            content=tc_layout.content
        )

        for rc_layout_sharing in LayoutSharingTc.objects.filter(parentLayout=tc_layout):
            LayoutShare.objects.create(
                parentLayout=newLayout,
                parentSchoolSharedWith=rc_layout_sharing.parentSchool
            )

    for image_assets in TcImageAssets.objects.all():
        ImageAssets.objects.create(
            image=image_assets.image,
        )
