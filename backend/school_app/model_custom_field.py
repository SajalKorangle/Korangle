from django.db import models
from django.db.models import ImageField, FileField, signals
# from django.dispatch import dispatcher
from django.dispatch import Signal
from django.conf import settings
import shutil, os, glob, re
from distutils.dir_util import mkpath

from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomImageField(ImageField):
    """Allows model instance to specify upload_to dynamically.

    Model class should have a method like:

        def get_upload_to(self, attname):
            return 'path/to/{0}'.format(self.id)
    """
    def __init__(self, *args, **kwargs):
        kwargs['upload_to'] = kwargs.get('upload_to', 'tmp')

        try:
            self.use_key = kwargs.pop('use_key')
        except KeyError:
            self.use_key = False

        super(CustomImageField, self).__init__(*args, **kwargs)

    def contribute_to_class(self, cls, name):
        """Hook up events so we can access the instance."""
        super(CustomImageField, self).contribute_to_class(cls, name)
        # dispatcher.connect(self._move_image, signal=signals.post_save, sender=cls)
        # Signal.connect(self._move_image, signal=signals.post_save, sender=cls)
        post_save.connect(self._move_image, sender=cls)

    '''def db_type(self):
        """Required by Django for ORM."""
        return 'varchar(100)' '''

    def _move_image(self, instance=None, **kwargs):
        """
            Function to move the temporarily uploaded image to a more suitable directory 
            using the model's get_upload_to() method.
        """
        if hasattr(instance, 'get_upload_to'):
            src = getattr(instance, self.attname)
            if src:
                print(self.upload_to)
                print(src)
                m = re.match(r"%s/(.*)" % self.upload_to, str(src))
                if m:
                    if self.use_key:
                        dst = "%s/%d_%s" % (instance.get_upload_to(self.attname), instance.id, m.groups()[0])
                    else:
                        dst = "%s/%s" % (instance.get_upload_to(self.attname), m.groups()[0])
                    basedir = "%s%s/" % (settings.MEDIA_ROOT, os.path.dirname(dst))
                    mkpath(basedir)
                    shutil.move("%s%s" % (settings.MEDIA_ROOT, src),"%s%s" % (settings.MEDIA_ROOT, dst))
                    setattr(instance, self.attname, dst)
                    instance.save()


'''class Image(models.Model):
    file = CustomImageField(use_key=True, upload_to='tmp')

    def get_upload_to(self, attname):
        return 'path/to/{0}'.format(self.id)'''
