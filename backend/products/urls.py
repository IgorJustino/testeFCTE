from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path('products/', views.products_list, name='products_list'),
    path('products/create/', csrf_exempt(views.create_product), name='create_product'),
    path('products/<int:pk>/', views.product_detail, name='product_detail'),
]