# 🚀 Configuração Supabase com Migrações

## ✅ Status: Configurado com CLI e Migrações

### 📁 Estrutura criada:
```
/supabase/
├── config.toml                                    # Configuração local
├── seed.sql                                       # Dados iniciais
└── migrations/
    ├── 20251114133829_create_user_profiles_table.sql
    ├── 20251114133838_create_products_table.sql
    ├── 20251114133844_create_messages_table.sql
    ├── 20251114133909_setup_rls_and_policies.sql
    └── 20251114133932_setup_storage_buckets.sql
```

## 🔗 Conectar ao Projeto Online

### 1. Criar projeto no Supabase.com (se não criou ainda):
1. Vá para [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote o **Project ID** (ex: `abc123def456`)

### 2. Conectar projeto local ao online:
```bash
# No terminal, na raiz do projeto:
supabase link --project-ref <PROJECT_ID>
# Substitua <PROJECT_ID> pelo ID do seu projeto
```

### 3. Enviar migrações para o projeto online:
```bash
# Aplicar todas as migrações
supabase db push

# OU aplicar uma migração específica
supabase migration up
```

## 🧪 Desenvolvimento Local (Opcional)

Para trabalhar completamente local (sem internet):

### 1. Iniciar banco local:
```bash
supabase start
```
**Aguarde:** Primeira execução demora ~3-5 minutos para baixar Docker images.

### 2. URLs locais que serão exibidas:
- **API URL**: http://127.0.0.1:54321
- **DB URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres  
- **Studio URL**: http://127.0.0.1:54323
- **Inbucket URL**: http://127.0.0.1:54324 (emails de teste)

### 3. Aplicar migrações no ambiente local:
```bash
supabase migration up
```

### 4. Parar ambiente local:
```bash
supabase stop
```

## ⚙️ Configurar Variáveis de Ambiente

### Para projeto online:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Para desenvolvimento local:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

## 📋 Comandos Úteis

### Gerenciar migrações:
```bash
# Criar nova migração
supabase migration new nome_da_migracao

# Listar migrações
supabase migration list

# Aplicar migrações pendentes
supabase migration up

# Reverter última migração
supabase migration down
```

### Gerenciar schema:
```bash
# Ver diferenças entre local e remoto
supabase db diff

# Gerar migração das diferenças
supabase db diff --file=new_migration

# Resetar banco local (CUIDADO!)
supabase db reset
```

### Status e logs:
```bash
# Ver status dos serviços
supabase status

# Ver logs
supabase logs

# Ver logs de uma função específica
supabase logs auth
```

## 🔄 Workflow Recomendado

### 1. Desenvolvimento:
```bash
# 1. Trabalhar localmente
supabase start

# 2. Criar mudanças no banco via Studio (http://127.0.0.1:54323)
# 3. Gerar migração das mudanças
supabase db diff --file=nova_funcionalidade

# 4. Testar migração
supabase migration up
```

### 2. Deploy:
```bash
# 1. Conectar ao projeto online (se ainda não fez)
supabase link --project-ref <PROJECT_ID>

# 2. Enviar migrações
supabase db push

# 3. Verificar se aplicou corretamente
supabase db diff  # deve mostrar "No schema changes detected"
```

## 🎯 Próximos Passos

1. **✅ Configurar projeto online**: Criar conta e projeto no Supabase
2. **✅ Conectar projeto**: `supabase link --project-ref <ID>`  
3. **✅ Aplicar migrações**: `supabase db push`
4. **✅ Configurar variáveis**: Atualizar `.env.local`
5. **✅ Testar aplicação**: `npm run dev` e testar cadastro/login

## 🐛 Troubleshooting

**❌ Erro ao aplicar migração:**
```bash
# Ver detalhes do erro
supabase db push --debug

# Ou aplicar uma de cada vez
supabase migration up --limit 1
```

**❌ Conflito de schema:**
```bash
# Ver diferenças
supabase db diff

# Resetar local para match com remoto
supabase db pull
```

**❌ Docker não funciona:**
- Instalar Docker: https://docs.docker.com/engine/install/
- Ou usar apenas o projeto online (sem `supabase start`)

---

💡 **Vantagem das migrações**: Controle de versão do banco, fácil deploy, colaboração em equipe!