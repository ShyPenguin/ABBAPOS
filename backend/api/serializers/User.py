from rest_framework import serializers
from ..models import CustomUser, Order


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'email', 'mobile_number',
                  'password', 'business')


class UserCredentialsSerializers(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['reference_number', 'amount', 'date',
                  'status', 'customer', 'payment_method', 'discount', 'business', 'order_items']
