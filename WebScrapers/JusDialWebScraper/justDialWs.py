import time
import csv
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup


def get_school_name(body):
    anchor = body.find('span', {'class': 'jcn'}).a
    return anchor.get('title', 'No title attribute')


def which_digit(html):  # because the numbers in just-dial are in this format
    mapping_dict = {'icon-ji': 9,
                    'icon-dc': '+',
                    'icon-fe': '(',
                    'icon-hg': ')',
                    'icon-ba': '-',
                    'icon-lk': 8,
                    'icon-nm': 7,
                    'icon-po': 6,
                    'icon-rq': 5,
                    'icon-ts': 4,
                    'icon-vu': 3,
                    'icon-wx': 2,
                    'icon-yz': 1,
                    'icon-acb': 0,
                    }
    return mapping_dict.get(html, '')


def get_phone_number(body):
    i = 0
    phone_no = "No Number!"
    try:

        for item in body.find('p', {'class': 'contact-info'}):
            i += 1
            if i == 2:
                phone_no = ''
                try:
                    for element in item.find_all(class_=True):
                        classes = []
                        classes.extend(element["class"])
                        phone_no += str((which_digit(classes[1])))
                except:
                    pass
    except:
        pass
    body = body['data-href']
    soup = BeautifulSoup(body, 'html.parser')
    for a in soup.find_all('a', {"id": "whatsapptriggeer"}):
        # print (a)
        phone_no = str(a['href'][-10:])

    return phone_no


def scroll_to_bottom(body):
    page_length = body.execute_script(
        "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
    match = False
    while not match:
        last_count = page_length
        time.sleep(3)
        page_length = body.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
        if last_count == page_length:
            match = True


# main start from here
cityList = ['Bhopal']
fields = ['School Name', 'Mobile Number', 'Telephone Number']
max_page = 50

for city in cityList:
    page_number = 1
    file_name = "%s Shools.csv" % city
    out_file = open(file_name, "w")
    csv_writer = csv.DictWriter(out_file, delimiter=',', fieldnames=fields)
    csv_writer.writerow({'School Name': 'School Name', 'Mobile Number': 'Mobile Number', 'Telephone Number': 'Telephone Number'})
    while max_page + 1 > page_number:

        # initializing driver on every page because Just Dial is not allowing to pass through next pages using selenium
        driver = webdriver.Chrome(ChromeDriverManager().install())
        url = "https://www.justdial.com/%s/Schools/nct-10422444/page-%s" % (city, page_number)
        driver.get(url)
        scroll_to_bottom(driver)  # scrolling to the bottom
        time.sleep(30)
        page = driver.page_source
        soup = BeautifulSoup(page, features='html.parser')
        services = soup.find_all('li', {'class': 'cntanr'})

        for school_html in services:

            dict_service = {}
            name = get_school_name(school_html)
            phone = get_phone_number(school_html)

            if name is not None:
                dict_service['School Name'] = name
            if phone is not None:
                if phone.count('-') >= 2:
                    dict_service['Telephone Number'] = phone
                else:
                    dict_service['Mobile Number'] = phone

            # Write row to CSV
            csv_writer.writerow(dict_service)

        page_number += 1
        driver.quit()

    out_file.close()
