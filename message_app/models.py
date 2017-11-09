from django.db import models

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

class SubQuestion(models.Model):
	content = models.TextField()
	parentQuestion = models.ForeignKey(Question, on_delete=models.PROTECT, default=0)

	def __str__(self):
		return self.parentQuestion.parentChapter.parentSubject.name[:50] + " ---- " + self.content[:50]
		# return self.parentQuestion.content[:50] + " ---- " + self.content[:50]
