
def change_homework_answer_image_model(apps, schema_editor):

    HomeworkAnswerImageModel = apps.get_model('homework_app', 'HomeworkAnswerImage')
    HomeworkAnswerModel = apps.get_model('homework_app', 'HomeworkAnswer')


    answer_images = HomeworkAnswerImageModel.objects.all()

    for answer_image in answer_images:
        parent_homework_question = answer_image.parentHomeworkQuestion
        parent_student = answer_image.parentStudent
        temp = HomeworkAnswerModel.objects.get(parentHomeworkQuestion = parent_homework_question, parentStudent = parent_student)
        new_answer_object = HomeworkAnswerImageModel(parentHomeworkAnswer = temp, orderNumber = answer_image.orderNumber, answerImage = answer_image.answerImage)
        answer_image.delete()
        new_answer_object.save()

