from django.urls import path
from .views.Order import order, order_detail, orderItem, orderItem_detail
from .views.Authentication import login, logout
from .views.SignUp import signup, signup_detail
from .views.Item import item, item_detail, searchItem
from .views.Customer import customer, customer_detail
from .views.Category import category, category_detail
from .views.Checkpassword import checkpassword

urlpatterns = [
    path('auth/login', login),
    path('auth/logout', logout),
    path('signup/', signup),
    path('signup/<int:pk>/', signup_detail, name='user-detail'),
    path('items/', item),
    path('items/<int:pk>/', item_detail, name='item-detail'),
    path('items/search/', searchItem, name='item-search'),
    path('customers/', customer),
    path('customers/<int:pk>/', customer_detail, name='customer-detail'),
    path('category/', category),
    path('category/<int:pk>/', category_detail, name='category-detail'),
    path('order/', order),
    path('order/<int:pk>/', order_detail, name='order-detail'),
    path('order-item/', orderItem),
    path('order-item/<int:pk>/', orderItem_detail, name='orderItem_detail'),
    path('check-password/', checkpassword, name='check_password'),
]
