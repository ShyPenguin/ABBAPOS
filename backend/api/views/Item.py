from ..models import Item
from ..serializers.Item import ItemSerializerMutate, ItemSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics, filters


class ItemViewSet(ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializerMutate
    ordering_fields = '__all__'  # Allow ordering by all fields
    ordering = ['-id']  # Set the default ordering to be descending by 'id'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ItemSerializer
        return self.serializer_class

    def get_queryset(self):
        business = self.request.user.business

        queryset = Item.objects.filter(business=business)

        return queryset

    def perform_create(self, serializer):
        # Associate the created item with the authenticated user
        serializer.save(business=self.request.user.business)


item = ItemViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

item_detail = ItemViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


class ItemSearchView(generics.ListAPIView):
    serializer_class = ItemSerializer
    filter_backends = (filters.SearchFilter,)
    ordering_fields = '__all__'  # Allow ordering by all fields
    ordering = ['id']  # Set the default ordering to be descending by 'id'

    def get_queryset(self):
        business = self.request.user.business
        category = self.request.query_params.get('category', '')
        name = self.request.query_params.get('name', '')
        queryset = Item.objects.filter(business=business)

        # Apply filters based on category and item name
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset


searchItem = ItemSearchView.as_view()
