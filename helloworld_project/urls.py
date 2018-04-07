"""helloworld_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

api_version = 'v1.2/'

urlpatterns = [
	url(r'^admin/', admin.site.urls),
	url(r'^', include('message_app.urls')),
	url(r'^'+api_version+'school/', include('school_app.urls')),
	url(r'^'+api_version+'student/', include('student_app.urls')),
	url(r'^'+api_version+'expense/', include('expense_app.urls')),
	url(r'^'+api_version+'class/', include('class_app.urls')),
	url(r'^'+api_version+'fee/', include('fee_app.urls')),
	url(r'^'+api_version+'subjects/', include('subject_app.urls')),
	url(r'^'+api_version+'examinations/', include('examination_app.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

