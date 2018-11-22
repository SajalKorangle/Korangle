from team_app.models import Task

from rest_framework import serializers


class TaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


def get_task_list():

    task_list = []

    for task_object in Task.objects.all():
        task_list.append(TaskModelSerializer(task_object).data)

    return task_list
