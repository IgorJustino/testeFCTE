from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
	"""Perfil estendido do usuário"""
    
	CAMPUS_CHOICES = [
		('darcy', 'Campus Darcy Ribeiro'),
		('fcte', 'Campus FCTE'),
		('ceilandia', 'Campus Ceilândia'),
		('planaltina', 'Campus Planaltina'),
		('gama', 'Campus Gama'),
	]
    
	user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='Usuário')
	avatar = models.ImageField('Avatar', upload_to='avatars/%Y/%m/%d/', blank=True, null=True)
	bio = models.TextField('Biografia', blank=True)
	course = models.CharField('Curso', max_length=200, blank=True)
	campus = models.CharField('Campus', max_length=50, choices=CAMPUS_CHOICES)
	phone = models.CharField('Telefone', max_length=20, blank=True)
    
	# Estatísticas
	rating = models.DecimalField('Avaliação', max_digits=3, decimal_places=2, default=0.0)
	review_count = models.IntegerField('Número de Avaliações', default=0)
	total_sales = models.IntegerField('Total de Vendas', default=0)
    
	# Timestamps
	member_since = models.DateTimeField('Membro desde', auto_now_add=True)
	updated_at = models.DateTimeField('Atualizado em', auto_now=True)
    
	class Meta:
		verbose_name = 'Perfil de Usuário'
		verbose_name_plural = 'Perfis de Usuários'
    
	def __str__(self):
		return f"Perfil de {self.user.username}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	"""Cria automaticamente um perfil quando um usuário é criado"""
	if created:
		UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
	"""Salva o perfil quando o usuário é salvo"""
	if hasattr(instance, 'profile'):
		instance.profile.save()
