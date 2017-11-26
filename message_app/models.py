from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Class(models.Model):
	name = models.CharField(max_length=100)

	def __str__(self):
		"""A string representation of the model."""
		return self.name

class Subject(models.Model):
	name = models.CharField(max_length=100)
	parentClass = models.ForeignKey(Class, on_delete=models.PROTECT, default=0)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentClass.name+" --- "+self.name

class Chapter(models.Model):
	name = models.CharField(max_length=100)
	parentSubject = models.ForeignKey(Subject, on_delete=models.PROTECT, default=0)

	def __str__(self):
		"""A string representation of the model."""
		return self.parentSubject.parentClass.name+" --- "+self.parentSubject.name+" --- "+self.name

class Question(models.Model):
	content = models.TextField()
	parentChapter = models.ForeignKey(Chapter, on_delete=models.PROTECT, default=0)

	def __str__(self):
		return self.parentChapter.parentSubject.parentClass.name+" --- "+self.parentChapter.parentSubject.name+" --- "+self.parentChapter.name+" --- "+self.content[:50]

# Why can't we have all the subquestions in questions model only?
# Because questions parents are chapters while subquestions parents are another questions
# However it depends a lot on the library they are referring too, so let's rethink this whole situation.

class SubQuestion(models.Model):
	content = models.TextField()
	parentQuestion = models.ForeignKey(Question, on_delete=models.PROTECT, default=0)

	def __str__(self):
		return self.parentQuestion.parentChapter.parentSubject.name[:50] + " ---- " + self.content[:50]
		# return self.parentQuestion.content[:50] + " ---- " + self.content[:50]

class Paper(models.Model):

	parentUser = models.ForeignKey(User, on_delete=models.PROTECT, default=0)

	showRollNumber = models.BooleanField(default=False)
	showCode = models.BooleanField(default=False)

	code = models.CharField(max_length=50)
	heading = models.TextField()
	time = models.CharField(max_length=50)
	totalMarks = models.FloatField()

	def __str__(self):
		return self.parentUser.username + " --- " + self.heading[:50]

# Why we are keeping content of questions in PaperElement Model while there already exist two models Question and Subquestions?
# Because we are waiting to see how these things are going to react in the eco system.

class PaperElement(models.Model):

	ELEMENT_CHOICES = (
		( 'question', 'Question' ),
		( 'or', 'Or' ),
		( 'section', 'Section' ),
		( 'subquestion', 'SubQuestion' )
	)

	parentPaper = models.ForeignKey(Paper, on_delete=models.PROTECT, default=0)

	elementDbId = models.PositiveIntegerField(default=0)
	elementContent = models.TextField(default='')
	elementNumber = models.IntegerField(default=0)
	elementType = models.CharField(max_length=20,choices=ELEMENT_CHOICES,default='question')
	elementMarks = models.FloatField(default=0)

	def __str__(self):
		return self.parentPaper.heading[:10] + " --- " + self.elementType + " --- " + self.elementContent[:30]

