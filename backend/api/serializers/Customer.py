from ..models import Customer
from rest_framework import serializers


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id', 'name', 'code')


class CustomerSerializerMutate(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Customer
        fields = ('id', 'name', 'code')
