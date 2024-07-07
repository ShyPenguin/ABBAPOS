from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from ..models import CustomUser
from rest_framework.response import Response
from rest_framework import status


class CheckManagerPasswordView(APIView):

    def post(self, request, format=None):
        user_password = request.data.get('password', '')
        managers = CustomUser.objects.filter(
            groups__name='manager', business=request.user.business)

        for manager in managers:
            if check_password(user_password, manager.password):

                return Response({'message': 'Allowed'}, status=status.HTTP_200_OK)

        return Response({'message': 'Password is incorrect or user not found.'}, status=status.HTTP_400_BAD_REQUEST)


checkpassword = CheckManagerPasswordView.as_view()
