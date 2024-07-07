from ..models import Customer
from ..serializers.Customer import CustomerSerializerMutate, CustomerSerializer
from rest_framework.viewsets import ModelViewSet


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializerMutate
    ordering_fields = '__all__'  # Allow ordering by all fields
    ordering = ['-id']  # Set the default ordering to be descending by 'id'

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CustomerSerializer
        return self.serializer_class

    def get_queryset(self):
        business = self.request.user.business
        name = self.request.query_params.get('name', '')
        queryset = Customer.objects.filter(business=business)

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset

    def perform_create(self, serializer):
        # Associate the created item with the authenticated business
        serializer.save(business=self.request.user.business)


customer = CustomerViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

customer_detail = CustomerViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
