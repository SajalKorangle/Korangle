
from school_app.db_script.constants import initialize_brightstar_busstop, initialize_eklavya_busstop, initialize_champion_busstop

def populate_busstop(apps, schema_editor):

    populate_brightstar_busstop(apps, schema_editor)

    populate_eklavya_busstop(apps, schema_editor)

    populate_champion_busstop(apps, schema_editor)

def populate_brightstar_busstop(apps, schema_editor):

    BusStop = apps.get_model('school_app', 'BusStop')
    School = apps.get_model('school_app', 'School')

    school_object_brightstar = School.objects.get(user__username='brightstar')

    school_object_brighthindi= School.objects.get(user__username='brighthindi')

    for bus_stop in initialize_brightstar_busstop:

        bus_stop_object = BusStop(stopName=bus_stop['stopName'],
                                  kmDistance=bus_stop['kmDistance'],
                                  parentSchool=school_object_brightstar)

        bus_stop_object.save()

        bus_stop_object = BusStop(stopName=bus_stop['stopName'],
                                  kmDistance=bus_stop['kmDistance'],
                                  parentSchool=school_object_brighthindi)

        bus_stop_object.save()

def populate_eklavya_busstop(apps, schema_editor):
    BusStop = apps.get_model('school_app', 'BusStop')
    School = apps.get_model('school_app', 'School')

    school_object = School.objects.get(user__username='eklavya')

    for bus_stop in initialize_eklavya_busstop:
        bus_stop_object = BusStop(stopName=bus_stop['stopName'],
                                  kmDistance=bus_stop['kmDistance'],
                                  parentSchool=school_object)

        bus_stop_object.save()

def populate_champion_busstop(apps, schema_editor):
    BusStop = apps.get_model('school_app', 'BusStop')
    School = apps.get_model('school_app', 'School')

    school_object = School.objects.get(user__username='champion')

    for bus_stop in initialize_eklavya_busstop:
        bus_stop_object = BusStop(stopName=bus_stop['stopName'],
                                  kmDistance=bus_stop['kmDistance'],
                                  parentSchool=school_object)

        bus_stop_object.save()
