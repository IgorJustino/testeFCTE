from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
	list_display = ['user', 'campus', 'course', 'rating', 'total_sales', 'member_since']
	list_filter = ['campus', 'member_since']
	search_fields = ['user__username', 'user__email', 'course']
	readonly_fields = ['rating', 'review_count', 'total_sales', 'member_since', 'updated_at']
    
	fieldsets = (
		('Usuário', {
			'fields': ('user',)
		}),
		('Informações do Perfil', {
			'fields': ('avatar', 'bio', 'course', 'campus', 'phone')
		}),
		('Estatísticas', {
			'fields': ('rating', 'review_count', 'total_sales', 'member_since', 'updated_at'),
			'classes': ('collapse',)
		}),
	)

