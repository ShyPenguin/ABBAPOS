from ..models import Item
from rest_framework import serializers
from .Category import CategorySerializer


class ItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Item
        fields = ('id', 'name', 'code', 'unit_of_measure', 'price', 'category')


class ItemSerializerMutate(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    category_name = serializers.CharField(
        source='category.name', read_only=True)
    category_detail = CategorySerializer(read_only=True)

    class Meta:
        model = Item
        fields = ('id', 'name', 'code', 'unit_of_measure',
                  'price', 'category', 'category_name', 'category_detail')
