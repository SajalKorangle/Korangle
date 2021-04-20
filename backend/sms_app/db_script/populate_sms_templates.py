def populate_sms_templates(apps, schema_editor):
    sms_template = apps.get_model('sms_app', 'SMSTemplate')
    sender_id = apps.get_model('sms_app', 'SenderId')

    # SNCSCH Templates

    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='SNCSCH'), templateName='Project 2',
                                    templateId='1007396821056959918',
                                    rawContent='सभी को सूचित किया जाता है कि कक्षा {#var#} से कक्षा {#var#} तक '
                                               'प्रोजेक्ट के माध्यम से अगली कक्षा में प्रमोट किया जाएगा जिस '
                                               'विद्यार्थी का रजिस्ट्रेशन रहेगा उसी विद्यार्थियों को प्रमोट किया '
                                               'जाएगा जिसका रजिस्ट्रेशन नही होगा वह विद्यार्थी उसी कक्षा में रहेगा '
                                               'रजिस्ट्रेशन शुल्क {#var#} है रजिस्ट्रेशन शुल्क {#var#} {#var#} से {'
                                               '#var#} {#var#} तक होगा शासन के निर्देश अनुसार धन्यवाद {#var#}\nसाई '
                                               'नाथ कॉन्वेंट हाई स्कूल आसारेटा ',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='SNCSCH'), templateName='1',
                                    templateId='1007611414244971241',
                                    rawContent='सूचित किया जाता है कि कक्षा 9 वी वार्षिक परीक्षा और कक्षा 10 की प्री '
                                               'बोर्ड परीक्षा 15 अप्रेल से 22 अप्रेल तक निर्धारित की गई है तथा 9 वी '
                                               'की प्रेक्टिकल परीक्षा 12 तारीख को निर्धारित की गई है समय सुबह 8 से 11 '
                                               'साई नाथ कॉन्वेंट हाई स्कूल आसारेटा धन्यवाद ',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='SNCSCH'), templateName='fEE1',
                                    templateId='1007656419087571253',
                                    rawContent='प्रिय पालक आपके बच्चो की बकाया{#var#} फीस जमा करवाएं \nसाईं नाथ '
                                               'कान्वेंट हाई स्कूल ',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='SNCSCH'),
                                    templateName='Class pramot 3',
                                    templateId='1007780528290207628',
                                    rawContent='कक्षा नर्सरी से कक्षा 8 तक प्रोजेक्ट के लिए अपने बच्चों का '
                                               'रजिस्ट्रेशन कराए रजिस्ट्रेशन शुल्क {#var#}रजिस्ट्रेशन की अंतिम तारीख '
                                               '{#var#} {#var#} है {#var#} जनवरी के बाद रजिस्ट्रेशन नही होगा जो '
                                               'विद्यार्थी रजिस्ट्रेशन के लिए रह जाता है वह विद्यार्थी अगली कक्षा में '
                                               'प्रमोट नही होगा इसके लिए विद्यालय जिम्मेदार नही रहेगा शासन के '
                                               'आदेशानुसार \nधन्यवाद\n{#var#} साई नाथ कॉन्वेंट हाई स्कूल आसारेटा ',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='SNCSCH'),
                                    templateName='Class pramot',
                                    templateId='1007898821277098743',
                                    rawContent='सूचित किया जाता है कि कक्षा प्रमोट के लिए 2000 रजिस्ट्रेशन शुल्क जमा '
                                               'करके अगली कक्षा में प्रवेश कराए अन्यथा विद्यालय की जवाबदारी नही होगी '
                                               'अंतिम तारीख 31 मार्च 2020 है धन्यवाद साई नाथ कॉन्वेंट हाई स्कूल '
                                               'आसारेटा {#var#}',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()

    # KRISHL Templates

    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='HEAVY RAIN MULTI HOLIDAY',
                                    templateId='1007029950687039923',
                                    rawContent='भारी वर्षा के कारण  दिनांक {#var#} तक अवकाश रहेगा l K.R.INTERNATIONAL '
                                               'SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='SINGLE HOLIDAY',
                                    templateId='1007068130451011747',
                                    rawContent='{#var#} के कारण कल दिनांक {#var#} दिन {#var#} को अवकाश रहेगा l '
                                               'K.R.INTERNATIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='EXAM ADMIT CARD NOTICE',
                                    templateId='1007331804017960086',
                                    rawContent='सभी विद्यार्थियों  की {#var#} परीक्षा दिनांक {#var#} से शुरू हो रही '
                                               'हे फीस जमा होने पर ही प्रवेश पत्र दिया जायेगा एवं बिना प्रवेश पत्र '
                                               'परीक्षा में शामिल नहीं किया जायेगा l K.R.INTERNATIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='PRACTICAL EXAM',
                                    templateId='1007364319770069324',
                                    rawContent='{#var#}  के विद्यार्थियों की प्रायोगिक परीक्षा दिनांक {#var#} को '
                                               'रहेगी l  K.R.INTERANTIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='FESTIVAL WISHESH',
                                    templateId='1007377397125750877',
                                    rawContent='सभी देशवासियो को {#var#} की हार्दिक शुभकामनाए l K.R.INTERNATIONAL '
                                               'SCHOOL',
                                    communicationType='SERVICE EXPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='FESTIVAL HOLIDAY',
                                    templateId='1007443901471376323',
                                    rawContent='{#var#} अवकाश दिनांक {#var#} तक रहेगा l  K.R.INTERANTIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='SCHOOL OPENING NOTICE',
                                    templateId='1007723775029026725',
                                    rawContent='समस्त पालक को सूचित किया जाता हे की दिनांक {#var#} से विद्यालय की '
                                               'नियमित कक्षाए प्रारम्भ हो रही हे l K.R.INTERNATIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='RAIN HOLIDAY',
                                    templateId='1007756116285795804',
                                    rawContent='भारी बरिश कि वजह से दिनांक {#var#} को विध्यालय मे अवकाश रहेगा '
                                               'K.R.INTERNATIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='REGULARTY AND DRESS NOTICE',
                                    templateId='1007820247064818055',
                                    rawContent='पालकगण को सूचित किया जाता हे की बच्चो को पूर्ण गणवेश में नियमित '
                                               'विद्यालय भेजे lK.R.INTERNATIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='FEE NOTICE WITH DATE',
                                    templateId='1007943032143259687',
                                    rawContent='पालकगण को सूचित किया जाता हे की अभी तक अगर आपने बच्चो की फीस जमा नहीं '
                                               'की हो तो कृपया दिनांक {#var#} तक जमा कराये अन्यथा बच्चो को कक्षा में '
                                               'प्रवेश नहीं दिया जायेगा l K.R.INTERNATIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='WINTER MULTI HOLIDAY',
                                    templateId='1007976742875501212',
                                    rawContent='शीतलहर के कारण विद्यालय में दिनांक {#var#} तक अवकाश रहेगा l '
                                               'K.R.INTERNATIONAL SCHOOL',
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='KRISHL'),
                                    templateName='PROGRAM INVITATION',
                                    templateId='1007991223338761165',
                                    rawContent='सभी पालकगण का विद्यालय में आयोजित {#var#} समारोह में अतिथि के रूप में '
                                               'हार्दिक स्वागत हे l K.R.INTERNATIONAL SCHOOL ',
                                    communicationType='SERVICE EXPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()

    # MAGADM Templates

    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='MAGADM'),
                                    templateName='FEE',
                                    templateId='1007153064361083189',
                                    rawContent="Magadham International School Dear parent,{#var#} Your ward's next "
                                               "fee installment is due{#var#}.Kindly pay to avoid late fee. Pls "
                                               "ignore if already paid ",
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSenderId=sender_id.objects.get(senderId='MAGADM'),
                                    templateName='due fees',
                                    templateId='1007944967990895781',
                                    rawContent="Magadham International School \nDear parent,{#var#} Your ward's next "
                                               "fee installment is due{#var#}.Kindly pay to avoid late fee. Pls "
                                               "ignore if already paid {#var#}",
                                    communicationType='SERVICE IMPLICIT', registrationStatus='APPROVED')
    new_sms_template.save()

