from .models import Book
from common.common_views_3 import CommonView, APIView
from decorators import user_permission_3

class BookRemoveImage(CommonView, APIView):
    Model = Book

    @user_permission_3
    def post(self, request, *args, **kwargs):
        data = {**request.data}
        update_data = {}
        update_data[data['imageType']] = None
        Book.objects.filter(id=data['id']).update(**update_data)
        
        return {'status': 'success'}