from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
import json

@csrf_exempt
def register_user(request):
    """API para cadastro de usuários"""
    if request.method == 'POST':
        try:
            # Se tem arquivos, usar request.POST, senão JSON
            if request.FILES or request.POST:
                data = request.POST
            else:
                data = json.loads(request.body)
            
            # Criar usuário
            user = User.objects.create_user(
                username=data.get('email', '').split('@')[0],  # Username baseado no email
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('name', '').split()[0] if data.get('name') else '',
                last_name=' '.join(data.get('name', '').split()[1:]) if len(data.get('name', '').split()) > 1 else ''
            )
            
            # Atualizar perfil estendido (já foi criado automaticamente pelo signal)
            from .models import UserProfile
            profile = user.profile
            profile.bio = f"Novo membro da comunidade FCTE"
            profile.course = "Não informado"
            profile.campus = "cruz_das_almas"  # Padrão
            
            # Salvar avatar se enviado
            if 'profile_photo' in request.FILES:
                profile.avatar = request.FILES['profile_photo']
            
            profile.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Usuário cadastrado com sucesso!',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': f"{user.first_name} {user.last_name}".strip()
                }
            })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Erro ao cadastrar usuário: {str(e)}'
            }, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def login_user(request):
    """API para login de usuários"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Autenticar usuário (buscar username pelo email)
            email = data.get('email')
            password = data.get('password')
            
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
            
            if user:
                return JsonResponse({
                    'success': True,
                    'message': 'Login realizado com sucesso!',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'name': f"{user.first_name} {user.last_name}".strip()
                    }
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Email ou senha incorretos'
                }, status=401)
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Erro no login: {str(e)}'
            }, status=400)
    
    return JsonResponse({'error': 'Método não permitido'}, status=405)

def users_list(request):
    """API para listar usuários"""
    users = User.objects.all()
    users_data = []
    
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': f"{user.first_name} {user.last_name}".strip(),
            'date_joined': user.date_joined.isoformat()
        }
        
        # Adicionar dados do perfil se existir
        if hasattr(user, 'profile'):
            profile = user.profile
            user_data.update({
                'bio': profile.bio,
                'course': profile.course,
                'campus': profile.campus,
                'avatar': profile.avatar.url if profile.avatar else None,
                'rating': float(profile.rating),
                'total_sales': profile.total_sales
            })
        
        users_data.append(user_data)
    
    return JsonResponse({'results': users_data})

def user_detail(request, user_id):
    """API para detalhes de um usuário específico"""
    try:
        user = User.objects.get(id=user_id)
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': f"{user.first_name} {user.last_name}".strip(),
            'date_joined': user.date_joined.isoformat()
        }
        
        # Adicionar dados do perfil se existir
        if hasattr(user, 'profile'):
            profile = user.profile
            user_data.update({
                'bio': profile.bio,
                'course': profile.course,
                'campus': profile.campus,
                'avatar': profile.avatar.url if profile.avatar else None,
                'rating': float(profile.rating),
                'total_sales': profile.total_sales
            })
        
        return JsonResponse(user_data)
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'Usuário não encontrado'}, status=404)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('users/', users_list, name='users-list'),
    path('users/<int:user_id>/', user_detail, name='user-detail'),
]