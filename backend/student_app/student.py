from school_app.models import Student, SessionClass

def get_student_list_session_class_wise(user, data):
	sessionDbId = data['sessionDbId']
	classDbId = data['classDbId']
	student_list = []
	for student_object in SessionClass.objects.get(parentSession__id=sessionDbId, parentClass__id=classDbId).student_set.all().order_by('name'):
		latest_session_dbid = student_object.sessionClass.all().latest('parentSession__endDate').parentSession.id
		if latest_session_dbid == sessionDbId:
			temp_student_object = {}
			temp_student_object['dbId'] = student_object.id
			temp_student_object['name'] = student_object.name
			temp_student_object['scholarNumber'] = student_object.scholarNumber
			student_list.append(temp_student_object)
	
	response = {}
	response['sessionDbId'] = sessionDbId
	response['classDbId'] = classDbId
	response['studentList'] = student_list

	return response

def promote_student_list(user, data):

	fromSessionDbId = data['fromSessionDbId']
	fromClassDbId = data['fromClassDbId']
	toSessionDbId = data['toSessionDbId']
	toClassDbId = data['toClassDbId']
	student_id_list = data['studentList']

	for student_object_id in student_id_list:
		student_object = Student.objects.get(id=student_object_id)
		previous_sessionClass_querySet = student_object.sessionClass.filter(parentSession__id=toSessionDbId)
		if len(previous_sessionClass_querySet) > 0:
			student_object.sessionClass.remove(previous_sessionClass_querySet[0])
		student_object.sessionClass.add(SessionClass.objects.get(parentSession__id=toSessionDbId, parentClass__id=toClassDbId))

	response = {}
	response['result'] = 'success'
	response['message'] = 'Students promoted successfully'

	fromData = {}
	fromData['sessionDbId'] = fromSessionDbId
	fromData['classDbId'] = fromClassDbId
	response['fromList'] = get_student_list_session_class_wise(user,fromData)

	toData = {}
	toData['sessionDbId'] = toSessionDbId
	toData['classDbId'] = toClassDbId
	response['toList'] = get_student_list_session_class_wise(user,toData)

	return response
