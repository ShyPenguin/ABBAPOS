from ..models import Category
from ..serializers.Category import CategorySerializer
from rest_framework.viewsets import ModelViewSet


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    ordering_fields = '__all__'
    ordering = ['-id']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CategorySerializer
        return self.serializer_class

    def get_queryset(self):
        business = self.request.user.business
        name = self.request.query_params.get('name', '')
        queryset = Category.objects.filter(business=business)

        if name:
            queryset = queryset.filter(name__icontains=name)
        return queryset

    def perform_create(self, serializer):
        # Associate the created category with the authenticated user's business
        serializer.save(business=self.request.user.business)


category = CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

category_detail = CategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
