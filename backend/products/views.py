from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import Product
import json

def products_list(request):
    """API para listar produtos reais do banco de dados"""
    products = Product.objects.filter(status='active').order_by('-created_at')
    
    products_data = []
    for product in products:
        product_data = {
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "price": float(product.price),
            "category": product.category,
            "condition": product.condition,
            "location": product.location,
            "views": product.views,
            "created_at": product.created_at.isoformat(),
            "seller_name": f"{product.seller.first_name} {product.seller.last_name}".strip() or product.seller.username,
            "seller_username": product.seller.username,
            "images": []  # Por enquanto vazio, pode adicionar lógica de imagens depois
        }
        products_data.append(product_data)
    
    return JsonResponse({"results": products_data})

def product_detail(request, pk):
    """API para detalhes de produto específico"""
    try:
        product = Product.objects.get(id=pk, status='active')
        
        product_data = {
            "id": product.id,
            "title": product.title,
            "description": product.description,
            "price": float(product.price),
            "category": product.category,
            "condition": product.condition,
            "location": product.location,
            "views": product.views,
            "created_at": product.created_at.isoformat(),
            "seller_name": f"{product.seller.first_name} {product.seller.last_name}".strip() or product.seller.username,
            "seller_username": product.seller.username,
            "images": []  # Por enquanto vazio
        }
        
        # Incrementar visualizações
        product.increment_views()
        
        return JsonResponse(product_data)
        
    except Product.DoesNotExist:
        return JsonResponse({"error": "Produto não encontrado"}, status=404)

@csrf_exempt
def create_product(request):
    """API para criar um novo produto"""
    if request.method == 'POST':
        try:
            # Se tem arquivos, usar request.POST, senão JSON
            if request.FILES or request.POST:
                data = request.POST
            else:
                data = json.loads(request.body)
            
            # Buscar usuário (por enquanto usar o primeiro usuário logado)
            user_id = data.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'ID do usuário é obrigatório'}, status=400)
            
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Usuário não encontrado'}, status=404)
            
            # Criar produto
            product = Product.objects.create(
                title=data.get('title'),
                description=data.get('description'),
                price=float(data.get('price', 0)),
                category=data.get('category'),
                condition=data.get('condition'),
                location=data.get('location'),
                seller=user
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Produto criado com sucesso!',
                'product': {
                    'id': product.id,
                    'title': product.title,
                    'price': float(product.price),
                    'category': product.category
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Erro ao criar produto: {str(e)}'
            }, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)
