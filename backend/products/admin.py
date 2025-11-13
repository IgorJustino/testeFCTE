from django.contrib import admin
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
	model = ProductImage
	extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ['title', 'seller', 'category', 'price', 'condition', 'status', 'views', 'created_at']
	list_filter = ['category', 'condition', 'status', 'location', 'created_at']
	search_fields = ['title', 'description', 'seller__username']
	readonly_fields = ['views', 'created_at', 'updated_at']
	inlines = [ProductImageInline]
    
	fieldsets = (
		('Informações Básicas', {
			'fields': ('title', 'description', 'price')
		}),
		('Categorização', {
			'fields': ('category', 'condition', 'status')
		}),
		('Localização', {
			'fields': ('location',)
		}),
		('Vendedor', {
			'fields': ('seller',)
		}),
		('Estatísticas', {
			'fields': ('views', 'created_at', 'updated_at'),
			'classes': ('collapse',)
		}),
	)


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
	list_display = ['product', 'order', 'created_at']
	list_filter = ['created_at']
	search_fields = ['product__title']

