# ⚡ Setup Rápido - Supabase Online

## 🚨 Problema com ambiente local
O ambiente local do Supabase está com timeout no Realtime. **Use o projeto online!**

## 🚀 Setup Online (5 minutos)

### 1. Criar Projeto no Supabase
1. Vá para [supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Configure:
   - **Name**: `AquiTem-FCTE`  
   - **Password**: Crie uma senha forte (anote!)
   - **Region**: South America (São Paulo)
4. Clique **"Create new project"**
5. ⏳ **Aguarde 2-3 minutos** para o projeto ser criado

### 2. Obter Credenciais
1. No dashboard, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **anon public key** (chave longa começando com `eyJ...`)

### 3. Configurar Ambiente
```bash
# Edite .env.local e substitua pelos valores reais:
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
```

### 4. Aplicar Migrações
```bash
# Conectar projeto local ao online
supabase link --project-ref SEU-PROJECT-ID

# Aplicar todas as migrações
supabase db push
```

### 5. Testar
```bash
npm run dev
# Acesse http://localhost:3000/cadastrar
```

## ⚠️ Se der erro na migração:

**Opção A: Usar SQL Editor**
1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie e cole o conteúdo de cada arquivo em `supabase/migrations/`
3. Execute um por vez na ordem:
   - `create_user_profiles_table.sql`
   - `create_products_table.sql`  
   - `create_messages_table.sql`
   - `setup_rls_and_policies.sql`
   - `setup_storage_buckets.sql`

**Opção B: Reset e tentar novamente**
```bash
supabase db reset --linked
supabase db push
```

## ✅ Verificação
- ✅ Projeto criado no Supabase.com
- ✅ Credenciais copiadas para .env.local
- ✅ Tabelas criadas (veja em Table Editor)
- ✅ Frontend funcionando (npm run dev)

---

💡 **Dica**: Depois que funcionar, você pode tentar o local novamente ou continuar só com online!