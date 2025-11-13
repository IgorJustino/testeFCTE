from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Conversation(models.Model):
	"""Conversa entre dois usuários sobre um produto"""
    
	participants = models.ManyToManyField(User, related_name='conversations', verbose_name='Participantes')
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='conversations', verbose_name='Produto')
	created_at = models.DateTimeField('Criado em', auto_now_add=True)
	updated_at = models.DateTimeField('Atualizado em', auto_now=True)
    
	class Meta:
		verbose_name = 'Conversa'
		verbose_name_plural = 'Conversas'
		ordering = ['-updated_at']
    
	def __str__(self):
		participants_names = ', '.join([user.username for user in self.participants.all()])
		return f"Conversa: {participants_names} - {self.product.title}"
    
	def get_last_message(self):
		"""Retorna a última mensagem da conversa"""
		return self.messages.order_by('-created_at').first()


class Message(models.Model):
	"""Mensagem em uma conversa"""
    
	conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages', verbose_name='Conversa')
	sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages', verbose_name='Remetente')
	text = models.TextField('Mensagem')
	is_read = models.BooleanField('Lida', default=False)
	created_at = models.DateTimeField('Criado em', auto_now_add=True)
    
	class Meta:
		verbose_name = 'Mensagem'
		verbose_name_plural = 'Mensagens'
		ordering = ['created_at']
    
	def __str__(self):
		return f"{self.sender.username}: {self.text[:50]}"
