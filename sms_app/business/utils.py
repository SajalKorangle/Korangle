def get_data_from_template(data):
    template = data["content"]
    # print("hi")
    ret = []
    for mobile in data["data"]:
        temp = template
        obj = {}
        obj["mobileNumber"] = mobile["mobileNumber"]
        for key, value in mobile.items():
            # print("yo")
            temp_from = "<"+key+">"
            # print(temp_from)
            # print(value)
            # print(temp.replace(temp_from, str(value)))
            temp = temp.replace(temp_from, str(value))
            # print(temp)
        obj["isAdvanceSms"] = temp
        ret.append(obj)
    return ret
