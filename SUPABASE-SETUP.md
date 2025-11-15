# 🚀 Configuração do Supabase para AquiTem FCTE

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js e npm instalados
3. Projeto Next.js funcionando

## 🔧 Passos para Configuração

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub/Google
4. Clique em "New project"
5. Escolha uma organização (ou crie uma)
6. Configure o projeto:
   - **Name**: `AquiTem-FCTE`
   - **Database Password**: Crie uma senha forte
   - **Region**: South America (São Paulo) - mais próximo do Brasil
7. Clique em "Create new project"

⏳ **Aguarde**: O projeto leva ~2-3 minutos para ser criado.

### 2. Obter Credenciais

1. No dashboard do projeto, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: `https://abc123def456.supabase.co`)
   - **anon public** key (chave longa começando com `eyJ...`)

### 3. Configurar Variáveis de Ambiente

1. No VS Code, abra o arquivo `.env.local` na raiz do projeto
2. Substitua pelos valores reais:

```bash
# Substitua pelos valores do seu projeto
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### 4. Configurar Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Copie todo o conteúdo do arquivo `supabase-setup.sql`
4. Cole na query e clique em **Run** (ou Ctrl+Enter)

✅ **Verificação**: Você deve ver as tabelas criadas em **Table Editor**.

### 5. Configurar Autenticação

1. Vá em **Authentication** > **Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000` (para desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:3000/dashboard`
     - `http://localhost:3000/recuperar-senha`

### 6. Testar a Aplicação

1. Reinicie o servidor Next.js:
```bash
npm run dev
```

2. Acesse `http://localhost:3000/cadastrar`
3. Tente criar uma conta com um email real
4. Verifique se recebeu o email de confirmação
5. Confirme a conta clicando no link do email
6. Faça login em `http://localhost:3000/entrar`

## 🔍 Verificação e Debug

### Verificar se as Tabelas foram Criadas

No Supabase dashboard > **Table Editor**, você deve ver:
- ✅ `user_profiles`
- ✅ `products`
- ✅ `messages`

### Verificar Storage

Em **Storage**, você deve ver os buckets:
- ✅ `avatars`
- ✅ `product-images`

### Debug de Problemas Comuns

**❌ Erro: "Invalid API key"**
- Verifique se copiou a chave correta
- Certifique-se de usar a `anon public` key, não a `service_role`

**❌ Erro: "Project not found"**
- Verifique se a URL está correta
- Certifique-se de que o projeto está ativo

**❌ Usuário não consegue se cadastrar**
- Verifique se as tabelas foram criadas
- Vá em **Authentication** > **Users** para ver usuários cadastrados

**❌ Erro de CORS**
- Configure a **Site URL** corretamente nas configurações de autenticação

## 🔄 Migrando do Django

Se você quiser migrar dados do SQLite para Supabase:

1. **Exportar usuários do Django:**
```bash
cd backend
python3 manage.py shell
>>> from django.contrib.auth.models import User
>>> users = User.objects.all()
>>> for user in users:
...     print(f"Email: {user.email}, Nome: {user.first_name} {user.last_name}")
```

2. **Importar manualmente** ou criar script de migração

## 🎯 Próximos Passos

1. ✅ Cadastro com Supabase
2. ✅ Login com Supabase  
3. 🔄 Atualizar páginas para usar componentes Supabase
4. 🔄 Implementar upload de imagens
5. 🔄 Criar sistema de produtos
6. 🔄 Implementar chat/mensagens

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do console do browser (F12)
2. Verifique os logs do Supabase dashboard
3. Consulte a [documentação oficial](https://supabase.com/docs)

---

💡 **Dica**: Mantenha o projeto Django como backup até confirmar que tudo funciona no Supabase!