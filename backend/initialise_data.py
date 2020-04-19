from school_app.factory.factory_models.py import UserFactory

def make_objects():

    # Let's create a few, known objects.
    UserFactory(
        username='1234567890',
        password='1234567890',
        firstname='Luke',
    )

