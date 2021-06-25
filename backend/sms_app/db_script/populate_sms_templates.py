def populate_sms_templates(apps, schema_editor):
    sms_template = apps.get_model('sms_app', 'SMSTemplate')
    sms_id = apps.get_model('sms_app', 'SMSId')

    # SNCSCH Templates

    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='SNCSCH'), templateName='Project 2',
                                    templateId='1007396821056959918',
                                    rawContent='सभी को सूचित किया जाता है कि कक्षा {#var#} से कक्षा {#var#} तक '
                                               'प्रोजेक्ट के माध्यम से अगली कक्षा में प्रमोट किया जाएगा जिस '
                                               'विद्यार्थी का रजिस्ट्रेशन रहेगा उसी विद्यार्थियों को प्रमोट किया '
                                               'जाएगा जिसका रजिस्ट्रेशन नही होगा वह विद्यार्थी उसी कक्षा में रहेगा '
                                               'रजिस्ट्रेशन शुल्क {#var#} है रजिस्ट्रेशन शुल्क {#var#} {#var#} से {'
                                               '#var#} {#var#} तक होगा शासन के निर्देश अनुसार धन्यवाद {#var#}\nसाई '
                                               'नाथ कॉन्वेंट हाई स्कूल आसारेटा ',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='SNCSCH'), templateName='1',
                                    templateId='1007611414244971241',
                                    rawContent='सूचित किया जाता है कि कक्षा 9 वी वार्षिक परीक्षा और कक्षा 10 की प्री '
                                               'बोर्ड परीक्षा 15 अप्रेल से 22 अप्रेल तक निर्धारित की गई है तथा 9 वी '
                                               'की प्रेक्टिकल परीक्षा 12 तारीख को निर्धारित की गई है समय सुबह 8 से 11 '
                                               'साई नाथ कॉन्वेंट हाई स्कूल आसारेटा धन्यवाद ',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='SNCSCH'), templateName='fEE1',
                                    templateId='1007656419087571253',
                                    rawContent='प्रिय पालक आपके बच्चो की बकाया{#var#} फीस जमा करवाएं \nसाईं नाथ '
                                               'कान्वेंट हाई स्कूल ',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='SNCSCH'),
                                    templateName='Class pramot 3',
                                    templateId='1007780528290207628',
                                    rawContent='कक्षा नर्सरी से कक्षा 8 तक प्रोजेक्ट के लिए अपने बच्चों का '
                                               'रजिस्ट्रेशन कराए रजिस्ट्रेशन शुल्क {#var#}रजिस्ट्रेशन की अंतिम तारीख '
                                               '{#var#} {#var#} है {#var#} जनवरी के बाद रजिस्ट्रेशन नही होगा जो '
                                               'विद्यार्थी रजिस्ट्रेशन के लिए रह जाता है वह विद्यार्थी अगली कक्षा में '
                                               'प्रमोट नही होगा इसके लिए विद्यालय जिम्मेदार नही रहेगा शासन के '
                                               'आदेशानुसार \nधन्यवाद\n{#var#} साई नाथ कॉन्वेंट हाई स्कूल आसारेटा ',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='SNCSCH'),
                                    templateName='Class pramot',
                                    templateId='1007898821277098743',
                                    rawContent='सूचित किया जाता है कि कक्षा प्रमोट के लिए 2000 रजिस्ट्रेशन शुल्क जमा '
                                               'करके अगली कक्षा में प्रवेश कराए अन्यथा विद्यालय की जवाबदारी नही होगी '
                                               'अंतिम तारीख 31 मार्च 2020 है धन्यवाद साई नाथ कॉन्वेंट हाई स्कूल '
                                               'आसारेटा {#var#}',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()

    # KRISHL Templates

    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='HEAVY RAIN MULTI HOLIDAY',
                                    templateId='1007029950687039923',
                                    rawContent='भारी वर्षा के कारण  दिनांक {#var#} तक अवकाश रहेगा l K.R.INTERNATIONAL '
                                               'SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='SINGLE HOLIDAY',
                                    templateId='1007068130451011747',
                                    rawContent='{#var#} के कारण कल दिनांक {#var#} दिन {#var#} को अवकाश रहेगा l '
                                               'K.R.INTERNATIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='EXAM ADMIT CARD NOTICE',
                                    templateId='1007331804017960086',
                                    rawContent='सभी विद्यार्थियों  की {#var#} परीक्षा दिनांक {#var#} से शुरू हो रही '
                                               'हे फीस जमा होने पर ही प्रवेश पत्र दिया जायेगा एवं बिना प्रवेश पत्र '
                                               'परीक्षा में शामिल नहीं किया जायेगा l K.R.INTERNATIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='PRACTICAL EXAM',
                                    templateId='1007364319770069324',
                                    rawContent='{#var#}  के विद्यार्थियों की प्रायोगिक परीक्षा दिनांक {#var#} को '
                                               'रहेगी l  K.R.INTERANTIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='FESTIVAL WISHESH',
                                    templateId='1007377397125750877',
                                    rawContent='सभी देशवासियो को {#var#} की हार्दिक शुभकामनाए l K.R.INTERNATIONAL '
                                               'SCHOOL',
                                    communicationType=2, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='FESTIVAL HOLIDAY',
                                    templateId='1007443901471376323',
                                    rawContent='{#var#} अवकाश दिनांक {#var#} तक रहेगा l  K.R.INTERANTIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='SCHOOL OPENING NOTICE',
                                    templateId='1007723775029026725',
                                    rawContent='समस्त पालक को सूचित किया जाता हे की दिनांक {#var#} से विद्यालय की '
                                               'नियमित कक्षाए प्रारम्भ हो रही हे l K.R.INTERNATIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='RAIN HOLIDAY',
                                    templateId='1007756116285795804',
                                    rawContent='भारी बरिश कि वजह से दिनांक {#var#} को विध्यालय मे अवकाश रहेगा '
                                               'K.R.INTERNATIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='REGULARTY AND DRESS NOTICE',
                                    templateId='1007820247064818055',
                                    rawContent='पालकगण को सूचित किया जाता हे की बच्चो को पूर्ण गणवेश में नियमित '
                                               'विद्यालय भेजे lK.R.INTERNATIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='FEE NOTICE WITH DATE',
                                    templateId='1007943032143259687',
                                    rawContent='पालकगण को सूचित किया जाता हे की अभी तक अगर आपने बच्चो की फीस जमा नहीं '
                                               'की हो तो कृपया दिनांक {#var#} तक जमा कराये अन्यथा बच्चो को कक्षा में '
                                               'प्रवेश नहीं दिया जायेगा l K.R.INTERNATIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='WINTER MULTI HOLIDAY',
                                    templateId='1007976742875501212',
                                    rawContent='शीतलहर के कारण विद्यालय में दिनांक {#var#} तक अवकाश रहेगा l '
                                               'K.R.INTERNATIONAL SCHOOL',
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KRISHL'),
                                    templateName='PROGRAM INVITATION',
                                    templateId='1007991223338761165',
                                    rawContent='सभी पालकगण का विद्यालय में आयोजित {#var#} समारोह में अतिथि के रूप में '
                                               'हार्दिक स्वागत हे l K.R.INTERNATIONAL SCHOOL ',
                                    communicationType=2, registrationStatus='APPROVED')
    new_sms_template.save()

    # MAGADM Templates

    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='MAGADM'),
                                    templateName='FEE',
                                    templateId='1007153064361083189',
                                    rawContent="Magadham International School Dear parent,{#var#} Your ward's next "
                                               "fee installment is due{#var#}.Kindly pay to avoid late fee. Pls "
                                               "ignore if already paid ",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='MAGADM'),
                                    templateName='due fees',
                                    templateId='1007944967990895781',
                                    rawContent="Magadham International School \nDear parent,{#var#} Your ward's next "
                                               "fee installment is due{#var#}.Kindly pay to avoid late fee. Pls "
                                               "ignore if already paid {#var#}",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()

    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au10',
                                    templateId='1007007354407837911',
                                    rawContent="Dear Parent, There will be PTM on {#var#} for Grade {#var#} from {"
                                               "#var#}.. REGARDS  \n{#var#} Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au3',
                                    templateId='1007016620789865841',
                                    rawContent="Dear {#var#},\nकक्षा {#var#} से शुरू हो रही हैं जो की अनिवार्य है "
                                               "अन्यथा बच्चे को अगली कक्षा में प्रमोट करना मुश्किल होगा. तुरंत स्कूल "
                                               "आकर संपर्क करें l  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au24',
                                    templateId='1007020405959073524',
                                    rawContent="-:सूचना:- आदरणीय अभिभावक, शुल्क की {#var#} INS का समय समाप्त हो चुका "
                                               "है! सभी को समय समय पर सूचना देने पर भी आपके बच्चो का शुल्क जमा नही "
                                               "हुआ! यदि कल दिनाक तक आप स्कूल से सम्पर्क नही करते है या शुल्क जमा नही "
                                               "करते है! इस परिस्थिति में आपके बच्चो को व्हात्सप्प ग्रुप व ऑनलाइन "
                                               "क्लास की सुविधा नही दि जाएगी! इसके जिम्मेदार आप स्वयं होगे! जिन बच्चो "
                                               "का शुल्क जमा है वे इस सूचना को अंन्यथा ना लेवे! व स्कूल में सम्पर्क "
                                               "करे! {#var#} से {#var#}  \nKorangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au23',
                                    templateId='1007080061104837383',
                                    rawContent="यदि आपने कक्षा {#var#} नहीं प्राप्त की हे तो ऑफिस आकर जल्द प्राप्त कर "
                                               "लेवे !  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='korangle1',
                                    templateId='1007104431187151556',
                                    rawContent="Korangle School Software\nइस सत्र के लिए \nशिक्षा विभाग की गाइड लाइन "
                                               "अनुसार\n कोरोना स्पेशल फीचर्स \n*परीक्षा का संचालन मोबाइल व कंप्यूटर "
                                               "से\n*स्वनिर्धारित रीपोर्ड कार्ड व\n*स्कूल मैनेजमेंट के सभी फीचर्स "
                                               "\nअपने स्कूल को जोड़ने के लिए कॉल करें\n{#var#}",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au25',
                                    templateId='1007106653932327778',
                                    rawContent="{#var#} at {#var#} there will be a compulsory PTM & registration "
                                               "process for Grade {#var#} Commerce students..  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au19',
                                    templateId='1007110198246738636',
                                    rawContent="आज एग्जाम फॉर्म हेतु फ़ोटो लेकर आवें या खिंचवाने आवें समय {#var#}  "
                                               "KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au17',
                                    templateId='1007125275943955764',
                                    rawContent="कक्षा {#var#} तक की अर्द्ध वार्षिक परीक्षा शुरू हो चुकी हैI प्रश्न "
                                               "पत्र प्राप्त करने की अंतिम दिनाँक {#var#} है जिसके बाद परीक्षा नहीं "
                                               "ली जाएगीl  {#var#} \nKorangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au2',
                                    templateId='1007131767465682960',
                                    rawContent="कक्षा {#var#} रजिस्ट्रेशन स्टार्ट हो गए है धन्यवाद \nसाई नाथ कॉन्वेंट "
                                               "हाई स्कूल आसारेटा  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au7',
                                    templateId='1007138477124000263',
                                    rawContent="Hi {#var#} Khan {#var#};s fees due till date is Rs. {#var#} |  \n{"
                                               "#var#} Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au5',
                                    templateId='1007153112343077746',
                                    rawContent="New Homework is added in Account, Title - {#var#} Last date to submit "
                                               "- null  {#var#}\nKorangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au9',
                                    templateId='1007189643592509538',
                                    rawContent="{#var#} कल दिनांक {#var#} को विद्यालय का अवकाश रहेगा।  \n{#var#} "
                                               "Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au20',
                                    templateId='1007238840414357839',
                                    rawContent="शासकीय आदेश अनुसार {#var#} तक {#var#} रहेगा साई नाथ कॉन्वेंट हाई "
                                               "स्कूल आसारेटा  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='winter break',
                                    templateId='1007252444544559917',
                                    rawContent="modal public school ashta\nDate {#var#} Dear Students, It is to be "
                                               "informed that School will remain closed for ten days from 21 December "
                                               "to 31st December and will reopen on 1st of January. It is to be "
                                               "informed that school will remain closed due to winter "
                                               "break.\nKorangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au16',
                                    templateId='1007271790340825386',
                                    rawContent="{#var#} parent, Mid term exam are going on &amp; your ward did {"
                                               "#var#} appear for {#var#} on {#var#} &amp; {#var#} please send him "
                                               "for next exam. {#var#}  Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au18',
                                    templateId='1007281499713023900',
                                    rawContent="There will be Dussehra holidays from {#var#} for grade Nur to {#var#} "
                                               " \n{#var#} Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au11',
                                    templateId='1007387468940473354',
                                    rawContent="Dear Parent, Tomorrow {#var#} There is a PTM for Grade {#var#} from {"
                                               "#var#} to {#var#} pm.. REGARDS \n{#var#} Korangle School Software ",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au15',
                                    templateId='1007389736170558078',
                                    rawContent="अभिभावक को सूचित किया जाता हे की अल्पसंख्यक छात्रवृति सम्बंधित "
                                               "दस्तावेज़ स्कूल में {#var#} के पूर्व जमा करे | परफेक्ट स्कूल  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au4',
                                    templateId='1007403971525746420',
                                    rawContent="Dear {#var#},\nआज {#var#} की pre board परीक्षा शुरू हो गई है जो कि "
                                               "अनिवार्य है. बच्चा आज अनुपस्थित था कृपया कल से परीक्षा दिलाएं.  "
                                               "KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au23',
                                    templateId='1007404009047051724',
                                    rawContent="कक्षा {#var#} के बोर्ड परीक्षा फॉर्म जमा हो रहे है , आपका {#var#} "
                                               "सत्र के शुल्क जमा करके ही इस सत्र के आवेदन किये जायेंगे {#var#}  "
                                               "Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au10',
                                    templateId='1007408548686944868',
                                    rawContent="{#var#} के सभी छात्र/छात्रावो को सूचित किया जाता हे की क्लास {#var#} "
                                               "तक के बच्चो का असाइमेंट होना हे उसी के आधार पर उनका क्लास प्रमोशन "
                                               "होना हे अतः सभी पालक गण दिनांक {#var#} को स्कूल में आकर उनकी सामग्री "
                                               "प्राप्त करें \nजो छात्र असाइमेंट नहीं देंगे उन्हें किसी भी हालत में "
                                               "क्लास प्रमोट नहीं किया जावेगा  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au4',
                                    templateId='1007411403939949292',
                                    rawContent="Your Homework Test - {#var#} of Subject Account has been {#var#}  \n{"
                                               "#var#} Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au21',
                                    templateId='1007444308762939131',
                                    rawContent="Korangle School Software \nDear {#var#} , As per your request your "
                                               "password updated. New password:- {#var#} You can login here: "
                                               "http://msg.msgclub.net  ",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au13',
                                    templateId='1007454036746737648',
                                    rawContent="{#var#} There is a PTM today {#var#} for Grade {#var#} from {#var#}.. "
                                               "{#var#}  \n{#var#} Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au21',
                                    templateId='1007477498527253631',
                                    rawContent="सत्र {#var#} के लिए रजिस्ट्रेशन शुल्क कक्षा {#var#}  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au15',
                                    templateId='1007478941291502289',
                                    rawContent="Dear {#var#} Mid term exam are going on &amp; your ward did not {"
                                               "#var#} for {#var#} kindly submit leave application. {#var#}  \n{"
                                               "#var#} Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au16',
                                    templateId='1007570700676287376',
                                    rawContent="Dear {#var#}, Your ward's next fee installment is due.Kindly pay to "
                                               "avoid late fee. Pls ignore if already paid.  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='fee demo',
                                    templateId='1007580206539279872',
                                    rawContent="प्रिय पालक आपके बच्चो की बकाया{#var#} फीस जमा करवाएं\nKorangle School "
                                               "Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au14',
                                    templateId='1007588227315963649',
                                    rawContent="DEAR PARENTS, There will be PTM for grade {#var#} tomorrow {#var#} "
                                               "timings are from {#var#}. lunch time from {#var#} {#var#} PTM "
                                               "restarts from {#var#}. REGARDS {#var#}\nKorangle School Software ",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au22',
                                    templateId='1007592778646174032',
                                    rawContent="{#var#} के विद्यार्थियों के अभिभावकों को सूचित किया जाता है कि {"
                                               "#var#} तक अपने बच्चों का प्रोजेक्ट वर्क के लिए रजिस्ट्रेशन करवाये "
                                               "वार्षिक परिणाम के लिए जिन बच्चों का रजिस्ट्रेशन होगा वही बच्चा {"
                                               "#var#} के लिए मान्य होगा अन्यथा वह विधार्थी उसी कक्षा में मान्य रहेगा "
                                               "धन्यवाद साई नाथ कॉन्वेंट हाई स्कूल आसारेटा संपर्क करे {#var#}  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au19',
                                    templateId='1007610248944292936',
                                    rawContent="कक्षा {#var#} से {#var#} की अर्द्ध वार्षिक परीक्षा दिनाँक {#var#} से "
                                               "शुरू हो रही है. परीक्षा ऑफलाइन ली जाएगी. कृपया {#var#} को स्कूल आकर "
                                               "प्रश्न पत्र का लिफाफा प्राप्त करेंl  \n{#var#} Korangle School "
                                               "Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au1',
                                    templateId='1007618159843086755',
                                    rawContent="आदरणीय पालकगण\nसादर नमस्कार\nसूचित किया जाता है कि कक्षा {#var#} तक {"
                                               "#var#} परीक्षा दिनांक {#var#} को आयोजित की जाएगी जिसमें बच्चो की "
                                               "परीक्षा सामग्री विद्यालय द्वारा पालक को प्राप्त कराई जाएगी इस परीक्षा "
                                               "सामग्री को बच्चा घर पर ही हल कर पुनः विद्यालय में {#var#} को जमा "
                                               "करवाई जाएगी !\nनोट - शासन आदेशानुसार बच्चा बिना परीक्षा दिए बच्चा "
                                               "अगली कक्षा में प्रमोट नही हो पायेगा ।\nधन्यवाद \nआज्ञा से प्राचार्य  "
                                               "KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au18',
                                    templateId='1007627308141318710',
                                    rawContent="Dear {#var#},\n{#var#} is the last date to submit answer sheets for "
                                               "grade {#var#}. no answer sheets will be accepted after that.\nRegards"
                                               "  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='model ashta',
                                    templateId='1007646886428616037',
                                    rawContent="{#var#}प्रिय पालक आपके बच्चो की बकाया फीस जमा करवाएं{#var#}\n {#var#} "
                                               "Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='modal school ashta1',
                                    templateId='1007680146454449759',
                                    rawContent="मॉडर्न पब्लिक स्कूल {#var#}\nप्रिय पालक आपके बच्चो की बकाया फीस जमा "
                                               "करवाएं। \nharshal agrawal\n ",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au12',
                                    templateId='1007684592233391358',
                                    rawContent="DEAR PARENTS, Tomorrow {#var#} there will be a PTM for grade {#var#} "
                                               "timings will be from {#var#}. REGARDS  \n{#var#} Korangle School "
                                               "Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='model ashta1',
                                    templateId='1007688298799584794',
                                    rawContent="Korangle School Software{#var#}\nप्रिय पालक आपके बच्चो की बकाया फीस "
                                               "जमा करवाएं",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='model ashta1',
                                    templateId='1007688298799584794',
                                    rawContent="Korangle School Software{#var#}\nप्रिय पालक आपके बच्चो की बकाया फीस "
                                               "जमा करवाएं",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au22',
                                    templateId='1007707150939255583',
                                    rawContent="{#var#} is the OTP requested by you to reset your password for "
                                               "korangle.com  ",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au24',
                                    templateId='1007707642758856947',
                                    rawContent="सूचित किया जाता है कक्षा 8 के बच्चों की {#var#} बदलकर {#var#} से हो "
                                               "गया है साई नाथ कॉन्वेंट हाई स्कूल धन्यवाद  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au6',
                                    templateId='1007717779360099488',
                                    rawContent="Korangle School Software\nइस सत्र के लिए निशुल्क शिक्षा विभाग की गाइड "
                                               "लाइन अनुसार कोरोना स्पेशल फीचर्स *परीक्षा का संचालन मोबाइल व कंप्यूटर "
                                               "से *स्वनिर्धारित रीपोर्ड कार्ड व *स्कूल मैनेजमेंट के सभी फीचर्स अपने "
                                               "स्कूल को जोड़ने के लिए कॉल करें {#var#}  {#var#}",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au9',
                                    templateId='1007745050627836127',
                                    rawContent="Korangle Softwares - Demo\n\nGo to www.korangle.com\n\nLogin Id: {"
                                               "#var#}\nPassword: {#var#}\n\nFor any queries, Call {#var#}  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au6',
                                    templateId='1007763274400768991',
                                    rawContent="साई नाथ परिवार को {#var#} की हार्दिक शुभकामनाएं  KORNGL",
                                    communicationType=2, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au7',
                                    templateId='1007792245263308041',
                                    rawContent="शासन के निर्देशानुसार पालकों को सूचित किया जाता है कि अपने बच्चों का "
                                               "अगली कक्षा में प्रमोट के लिए रजिस्ट्रेशन करवाये रजिस्ट्रेशन शुल्क {"
                                               "#var#} तक होगा तारीख निकल जाने के बाद विद्यालय की जवाबदारी नही होगी "
                                               "आपका अपना साई नाथ कॉन्वेंट हाई स्कूल आसारेटा सभी पेरेंट्स को {#var#} "
                                               "की हार्दिक शुभकामनाएं धन्यवाद  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au20',
                                    templateId='1007795938552396900',
                                    rawContent="{#var#} is the OTP requested by you to sign up for korangle.com",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au5',
                                    templateId='1007804254684323368',
                                    rawContent="{#var#} की हार्दिक शुभकामनाए साई नाथ कॉन्वेंट हाई स्कूल  KORNGL",
                                    communicationType=2, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au17',
                                    templateId='1007820792379707586',
                                    rawContent="कक्षा {#var#} के लिए कल से विद्यालय प्रारंभ धन्यवाद {#var#}  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au14',
                                    templateId='1007873909851900842',
                                    rawContent="Hi {#var#},\n{#var#} fees due till date is Rs. {#var#}  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au13',
                                    templateId='1007881219096065548',
                                    rawContent="Your {#var#} exam will be start from {#var#} So please submit your {"
                                               "#var#} installment before {#var#} examination.\nAll The Best  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au12',
                                    templateId='1007881447078045826',
                                    rawContent="अभिभावक को सूचित किया जाता हे की कल दिनांक {#var#} को परीक्षा एवं "
                                               "प्रोजेक्ट सम्बंधित मीटिंग रखी गई हे ,अभिभावक का आना अनिवार्य हे समय {"
                                               "#var#} तक -\nपरफेक्ट पब्लिक स्कूल  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='fee reminder',
                                    templateId='1007918547613006048',
                                    rawContent="Korangle School Software\n{#var#}school\nDear parents, "
                                               "Most respectfully, it is stated that the tuition fee for the month of "
                                               "{#var#} is pending against your child, {#var#} of grade {#var#}. We "
                                               "kindly request you to please clear your outstanding dues and pay the "
                                               "school in full by {#var#}",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au8',
                                    templateId='1007931346904054624',
                                    rawContent="Your Homework ASSIGNMENT {#var#} of Subject {#var#} has been asked "
                                               "for resubmission  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='har_m_d_jan_au3',
                                    templateId='1007935501742388754',
                                    rawContent="Dear parents, बच्चों की दूसरी पीरियोडिक परीक्षा 4 जनवरी से शुरू हो "
                                               "रही है जो कि अनिवार्य है. {#var#} परीक्षा {#var#} है. ऑफिस संडे खुला "
                                               "है संपर्क करें {#var#}  \n{#var#} Korangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='fee2',
                                    templateId='1007936437767598362',
                                    rawContent="Dear parent,{#var#} Your ward's next fee installment is due{"
                                               "#var#}.Kindly pay to avoid late fee. Pls ignore if already paid {"
                                               "#var#} \nKorangle School Software",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
    new_sms_template = sms_template(parentSMSId=sms_id.objects.get(smsId='KORNGL'),
                                    templateName='ko_m_feb_au11',
                                    templateId='1007967956241723887',
                                    rawContent="{#var#} स्पेशल \n\n- परीक्षा का संचालन मोबाइल/कंप्यूटर से \n- "
                                               "स्वनिर्धारित रिपोर्ट कार्ड\n\nअपने स्कूल की id एक्टिवेट करने के लिए "
                                               "कॉल करें {#var#} \n\nKorangle School Softwares  KORNGL",
                                    communicationType=1, registrationStatus='APPROVED')
    new_sms_template.save()
