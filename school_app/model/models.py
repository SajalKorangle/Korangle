from django.db import models
from django.contrib.auth.models import User

from school_app.model_custom_field import CustomImageField

from django.core.exceptions import ObjectDoesNotExist


def upload_avatar_to(instance, filename):
    import os
    from django.utils.timezone import now
    filename_base, filename_ext = os.path.splitext(filename)
    return 'schools/%s/main%s' % (instance.id, filename_ext.lower())


class Session(models.Model):

    startDate = models.DateField()
    endDate = models.DateField()
    name = models.TextField(default='',null=True)
    orderNumber = models.IntegerField(default=0)

    def __str__(self):
        return str(self.startDate) + ' --- ' + str(self.endDate)

    class Meta:
        db_table = 'session'


def get_user():
    if User.objects.filter(username='brightstar'):
        return User.objects.filter(username='brightstar')[0].id
    else:
        return 1


class School(models.Model):

    # user = models.ManyToManyField(User)
    name = models.TextField(null=True)
    printName = models.TextField(null=True)

    logo = CustomImageField(use_key=True, upload_to='tmp')

    profileImage = models.ImageField("Avatar", upload_to=upload_avatar_to, blank=True)

    mobileNumber = models.IntegerField(null=True)

    primaryThemeColor = models.TextField(null=True)
    secondaryThemeColor = models.TextField(null=True)
    complexFeeStructure = models.BooleanField(default=True)
    address = models.TextField(null=True)
    diseCode = models.TextField(null=True)
    currentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='currentSession', default=1)
    registrationNumber = models.TextField(null=False, default='426/13.01.1993')
    smsId = models.CharField(max_length=10, null=False, default='KORNGL', verbose_name='smsId')

    def get_upload_to(self, attname):
            return 'school/id/{0}'.format(self.id)

    def workingDays(self, session_object):
        try:
            return SchoolSession.objects.get(parentSchool=self, parentSession=session_object).workingDays
        except ObjectDoesNotExist:
            return None


    def save(self, profileImageUpdation = False, *args, **kwargs):
        super(School, self).save(*args, **kwargs)
        if profileImageUpdation:
            self.create_avatar_thumb()

    def create_avatar_thumb(self):
        import os
        from PIL import Image
        from django.core.files.storage import default_storage as storage
        if not self.profileImage:
            return ""
        file_path = self.profileImage.name
        filename_base, filename_ext = os.path.splitext(file_path)
        thumb_file_path = "%s_thumb%s" % (filename_base, filename_ext.lower())
        try:
            # resize the original image and return url path of the thumbnail
            f = storage.open(file_path, 'r')
            image = Image.open(f)
            width, height = image.size

            if width > height:
                delta = width - height
                left = int(delta/2)
                upper = 0
                right = height + left
                lower = height
            else:
                delta = height - width
                left = 0
                upper = int(delta/2)
                right = width
                lower = width + upper

            imageTwo = image.crop((left, upper, right, lower))
            imageTwo = imageTwo.resize((100, 100), Image.ANTIALIAS)

            f_thumb = storage.open(thumb_file_path, "w")
            imageTwo.save(f_thumb, format="PNG")
            f_thumb.close()

            return "success"
        except:
            return "error"

    def get_avatar_thumb_url(self):
        import os
        from django.core.files.storage import default_storage as storage
        if not self.profileImage:
            return ""
        file_path = self.profileImage.name
        filename_base, filename_ext = os.path.splitext(file_path)
        thumb_file_path = "%s_thumb.jpg" % filename_base
        if storage.exists(thumb_file_path):
            return storage.url(thumb_file_path)
        return ""

    def __str__(self):
        return self.printName

    class Meta:
        db_table = 'school'


class SchoolSession(models.Model):

    parentSession = models.ForeignKey(Session, on_delete=models.PROTECT, null=False, verbose_name='parentSession')
    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')
    workingDays = models.IntegerField(default=0)

    def __str__(self):
        return self.parentSession.name + ' --- ' + self.parentSchool.name + ' --- ' + str(self.workingDays)

    class Meta:
        db_table = 'school_session'
        unique_together = ( 'parentSession', 'parentSchool' )


class BusStop(models.Model):

    parentSchool = models.ForeignKey(School, on_delete=models.PROTECT, null=False, verbose_name='parentSchool')
    stopName = models.TextField(null=False)
    kmDistance = models.DecimalField(max_digits=7, decimal_places=1,null=False, default=0)

    def __str__(self):
        return self.parentSchool.name + ' --- ' + self.stopName + ' --- ' + str(self.kmDistance)

    class Meta:
        db_table = 'bus_stop'
        unique_together = ( 'parentSchool', 'stopName' )
