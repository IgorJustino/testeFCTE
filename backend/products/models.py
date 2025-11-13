from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
	"""Modelo para produtos do marketplace"""
    
	CONDITION_CHOICES = [
		('novo', 'Novo'),
		('usado_otimo', 'Usado - Ótimo Estado'),
		('usado_bom', 'Usado - Bom Estado'),
		('usado_regular', 'Usado - Regular Estado'),
		('usado', 'Usado'),
		('nao_especificado', 'Não especificado'),
	]
    
	STATUS_CHOICES = [
		('active', 'Ativo'),
		('sold', 'Vendido'),
		('inactive', 'Inativo'),
	]
    
	CATEGORY_CHOICES = [
		('eletronicos', 'Eletrônicos'),
		('livros', 'Livros'),
		('material_escolar', 'Material Escolar'),
		('moveis', 'Móveis'),
		('esportes', 'Esportes'),
		('moda', 'Moda'),
		('servicos', 'Serviços'),
		('outros', 'Outros'),
	]
    
	CAMPUS_CHOICES = [
		('darcy', 'Campus Darcy Ribeiro'),
		('fcte', 'Campus FCTE'),
		('ceilandia', 'Campus Ceilândia'),
		('planaltina', 'Campus Planaltina'),
		('gama', 'Campus Gama'),
	]
    
	# Campos básicos
	title = models.CharField('Título', max_length=200)
	description = models.TextField('Descrição')
	price = models.DecimalField('Preço', max_digits=10, decimal_places=2)
    
	# Categorização
	category = models.CharField('Categoria', max_length=50, choices=CATEGORY_CHOICES)
	condition = models.CharField('Condição', max_length=20, choices=CONDITION_CHOICES)
	status = models.CharField('Status', max_length=20, choices=STATUS_CHOICES, default='active')
    
	# Localização
	location = models.CharField('Campus', max_length=50, choices=CAMPUS_CHOICES)
    
	# Relacionamento
	seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products', verbose_name='Vendedor')
    
	# Estatísticas
	views = models.IntegerField('Visualizações', default=0)
    
	# Timestamps
	created_at = models.DateTimeField('Criado em', auto_now_add=True)
	updated_at = models.DateTimeField('Atualizado em', auto_now=True)
    
	class Meta:
		verbose_name = 'Produto'
		verbose_name_plural = 'Produtos'
		ordering = ['-created_at']
    
	def __str__(self):
		return self.title
    
	def increment_views(self):
		"""Incrementa o contador de visualizações"""
		self.views += 1
		self.save(update_fields=['views'])


class ProductImage(models.Model):
	"""Modelo para imagens dos produtos"""
    
	product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name='Produto')
	image = models.ImageField('Imagem', upload_to='products/%Y/%m/%d/')
	order = models.IntegerField('Ordem', default=0)
	created_at = models.DateTimeField('Criado em', auto_now_add=True)
    
	class Meta:
		verbose_name = 'Imagem do Produto'
		verbose_name_plural = 'Imagens dos Produtos'
		ordering = ['order', 'created_at']
    
	def __str__(self):
		return f"Imagem de {self.product.title}"
