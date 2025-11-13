from rest_framework import serializers
from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'order']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(source='seller.first_name', read_only=True)
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'category', 
            'condition', 'status', 'location', 'views',
            'created_at', 'updated_at', 'images',
            'seller_name', 'seller_username'
        ]
        read_only_fields = ['views', 'created_at', 'updated_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de produtos"""
    seller_name = serializers.CharField(source='seller.first_name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'price', 'category', 
            'condition', 'location', 'views',
            'created_at', 'seller_name'
        ]