from django.contrib import admin
from .models import Conversation, Message


class MessageInline(admin.TabularInline):
	model = Message
	extra = 0
	readonly_fields = ['sender', 'text', 'is_read', 'created_at']
	can_delete = False


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
	list_display = ['id', 'product', 'get_participants', 'created_at', 'updated_at']
	list_filter = ['created_at', 'updated_at']
	search_fields = ['product__title', 'participants__username']
	readonly_fields = ['created_at', 'updated_at']
	inlines = [MessageInline]
    
	def get_participants(self, obj):
		return ', '.join([user.username for user in obj.participants.all()])
	get_participants.short_description = 'Participantes'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
	list_display = ['conversation', 'sender', 'text_preview', 'is_read', 'created_at']
	list_filter = ['is_read', 'created_at']
	search_fields = ['text', 'sender__username']
	readonly_fields = ['created_at']
    
	def text_preview(self, obj):
		return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
	text_preview.short_description = 'Mensagem'

