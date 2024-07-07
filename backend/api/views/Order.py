from rest_framework import status
from rest_framework.response import Response
from ..serializers.Order import OrderSerializer,  OrderItemSerializer, OrderItemSerializerMutate
from ..serializers.Order import OrderSerializerMutate
from rest_framework.viewsets import ModelViewSet
from ..models import Order, OrderItem
from django.db.models import Sum
from ..paginator import CustomPagination


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    ordering_fields = '__all__'  # Allow ordering by all fields
    ordering = ['-id']  # Set the default ordering to be descending by 'id'

    def create(self, request, *args, **kwargs):
        order_items = request.data.pop('order_items')
        order_data = request.data
        order_data['business'] = request.user.business.id

        order_serializer = OrderSerializerMutate(data=order_data)

        if order_serializer.is_valid():
            order = order_serializer.save()
            for element in order_items:
                order_item = {}
                order_item["item"] = element["item"]["id"]
                order_item["quantity"] = element["quantity"]
                order_item["order"] = order.id
                order_item_serializer = OrderItemSerializerMutate(
                    data=order_item)
                if order_item_serializer.is_valid():
                    order_item_serializer.save()
                else:
                    return Response(order_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(order_serializer.data, status=status.HTTP_201_CREATED)

        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk, *args, **kwargs):
        request_order_items = request.data.pop('order_items', [])
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        order_serializer = OrderSerializerMutate(
            order, data=request.data, partial=True)

        if order_serializer.is_valid():
            order = order_serializer.save()

            response_order_items = []
            for element in request_order_items:
                qs = OrderItem.objects.filter(pk=element.get("id", -1))

                # If it does not exists then I want to create an order Item
                # If it does then I will update it
                if not qs.exists():
                    order_item = {}
                    order_item["item"] = element["item"]["id"]
                    order_item["quantity"] = element["quantity"]
                    order_item["order"] = order.id
                    order_item_serializer = OrderItemSerializerMutate(
                        data=order_item)
                    if order_item_serializer.is_valid():
                        order_item_serializer.save()
                    else:
                        return Response(order_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    order_item = qs[0]
                    element["item"] = element["item"]["id"]
                    order_item_serializer = OrderItemSerializerMutate(
                        order_item, data=element, partial=True)
                    if order_item_serializer.is_valid():
                        order_item_serializer.save()
                    else:
                        return Response(order_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                response_order_items.append(order_item_serializer.data)

            qs = OrderItem.objects.filter(order=order.id)

            if request.data.get('status', '') != "void":
                for item in qs:
                    # Check if an OrderItem with the same id exists in request_order_items
                    item_id = item.id
                    matching_item = next(
                        (element for element in response_order_items if element.get(
                            "id") == item_id),
                        None
                    )

                    if not matching_item:
                        # An item with the same id exists in request_order_items
                        try:
                            order_item = OrderItem.objects.get(pk=item_id)
                            order_item.delete()
                        except OrderItem.DoesNotExist:
                            return Response({'detail': f'One of your item does not exist {item.item}.'}, status=status.HTTP_404_NOT_FOUND)
            return Response(order_serializer.data, status=status.HTTP_200_OK)

        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        order = None
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        qs = OrderItem.objects.filter(order=pk)
        for item in qs:
            try:
                order_item = OrderItem.objects.get(pk=item.id)
                order_item.delete()
            except OrderItem.DoesNotExist:
                return Response({'detail': f'One of your item does not exist {item.item}.'}, status=status.HTTP_404_NOT_FOUND)
        order.delete()
        return Response({'detail': f'succesfully delted the order {order.reference_number}'},  status=status.HTTP_200_OK)

    def get_queryset(self):
        business = self.request.user.business
        status = self.request.query_params.get('status', '')
        queryset = Order.objects.filter(business=business)
        if status == "hold":
            queryset = queryset.filter(status=status)
        else:
            queryset = queryset.exclude(status="hold")

        return queryset

    def list(self, request, *args, **kwargs):
        self.pagination_class = CustomPagination
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        total_amount = 0
        if self.request.query_params.get('status', '') != "hold":
            qs_for_total_amount = queryset.filter(
                status__in=['charged', 'paid'])
            total_amount = qs_for_total_amount.aggregate(total_amount=Sum('amount'))[
                'total_amount'] or 0
        else:
            total_amount = queryset.aggregate(total_amount=Sum('amount'))[
                'total_amount'] or 0

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response({"data": serializer.data, "total_amount": total_amount})

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


order = OrderViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

order_detail = OrderViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


class OrderItemViewSet(ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializerMutate
    ordering_fields = '__all__'
    ordering = ['-id']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OrderItemSerializer
        return self.serializer_class


orderItem = OrderItemViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

orderItem_detail = OrderItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
