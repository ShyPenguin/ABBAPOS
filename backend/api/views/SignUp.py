from rest_framework.authtoken.models import Token
from ..models import CustomUser
from ..serializers.User import UserSerializer
from ..serializers.Business import BusinessSerializer
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.forms.models import model_to_dict
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from rest_framework import status
from rest_framework.decorators import action


class Record(ModelViewSet):
    permission_classes = []
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        # Existing create method code...
        business_data = request.data.get('business', {})
        business_serializer = BusinessSerializer(data=business_data)
        if business_serializer.is_valid():
            business = business_serializer.save()
        else:
            return Response(business_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        request.data['business'] = business.id
        request.data["password"] = make_password(request.data["password"])

        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            manager_group, created = Group.objects.get_or_create(
                name='manager')
            user.groups.add(manager_group)

            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'mobile_number': user.mobile_number,
                'business': model_to_dict(business),
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def add_user(self, request):
        # Check if the user making the request is in the 'manager' group
        manager_group = Group.objects.get(name='manager')
        if manager_group not in request.user.groups.all():
            return Response(
                {"detail": "You don't have permission to add users."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Extract the user role from the request data (default to 'employee')
        role = request.data.get('role', 'employee')

        # Create a user instance using the UserSerializer
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            # Assign the user to the specified role (manager or employee)
            role_group, created = Group.objects.get_or_create(name=role)
            user.groups.add(role_group)

            # Generate a token for the user
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'mobile_number': user.mobile_number,
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


signup = Record.as_view({
    'get': 'list',
    'post': 'create',
})

signup_detail = Record.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'

})
