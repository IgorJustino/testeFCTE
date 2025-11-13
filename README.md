- Node.js (versão 18 ou superior)
- Python 3.8+
- npm ou pnpm

### 1. Instalar dependências do Frontend (Next.js)

```bash
# Na pasta raiz do projeto
npm install
# ou
pnpm install
```

### 2. Configurar Backend (Django)

```bash
# Entre na pasta backend
cd backend

# Ative o ambiente virtual
source venv/bin/activate

# Instale as dependências (se necessário)
pip install -r requirements.txt
```

### 3. Executar o projeto

**Terminal 1 - Django Backend:**
```bash
cd backend
source venv/bin/activate
python manage.py runserver 127.0.0.1:8004
```

**Terminal 2 - Next.js Frontend:**
```bash
# Na pasta raiz
npm run dev
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8004/api/

*Projeto desenvolvido com Next.js 16.0.0 e Django 5.2.8*