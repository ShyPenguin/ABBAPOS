from ..models import Order, OrderItem
from rest_framework import serializers
from .Item import ItemSerializer
from .Category import CategorySerializer


class OrderItemSerializerMutate(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    item_name = serializers.CharField(
        source='item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'order', 'quantity', 'item', 'item_name')


class OrderItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'item', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField(read_only=True)
    customer = CategorySerializer(read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'reference_number', 'amount', 'date',
                  'status', 'customer', 'discount', 'payment_method', 'order_items')

    def get_order_items(self, obj):
        qs_order_items = OrderItem.objects.filter(order=obj.id)
        order_items = []
        for element in qs_order_items:
            serializer = OrderItemSerializer(element)
            order_items.append(serializer.data)
        return order_items


class OrderSerializerMutate(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField(read_only=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = ['id', 'reference_number', 'amount', 'date',
                  'status', 'customer', 'payment_method', 'discount', 'business', 'order_items']

    def get_order_items(self, obj):
        qs_order_items = OrderItem.objects.filter(order=obj.id)
        order_items = []
        for element in qs_order_items:
            serializer = OrderItemSerializer(element)
            order_items.append(serializer.data)
        return order_items
