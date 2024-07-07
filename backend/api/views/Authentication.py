from ..serializers.AuthToken import AuthTokenSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.response import Response
from django.forms.models import model_to_dict
from rest_framework.views import APIView


class CustomAuthToken(ObtainAuthToken):
    permission_classes = []
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as exc:
            if "Unable to log in with provided credentials" in str(exc):
                return Response({"message": "Invalid email/password"}, status=status.HTTP_400_BAD_REQUEST)

            raise

        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'mobile_number': user.mobile_number,
            'business': model_to_dict(user.business),
        })


login = CustomAuthToken.as_view()


class LogoutView(APIView):
    def delete(self, request, *args, **kwargs):
        user_token = Token.objects.get(user=request.user)
        user_token.delete()

        return Response({"message": "Logged out successfully"})


logout = LogoutView.as_view()
