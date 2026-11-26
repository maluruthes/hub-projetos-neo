# Hub de Projetos NEO

Sistema web desenvolvido para gerenciamento e visualização de projetos e membros, com funcionalidades de autenticação, controle de acesso e administração de usuários.

## Tecnologias utilizadas

### Frontend
- React
- Vite
- JavaScript
- Axios
- React Router

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT
- SQLite

## Estrutura do projeto

```text
hub-projetos-neo/
├── backend/
│   ├── config/
│   ├── members/
│   ├── projects/
│   ├── users/
│   ├── db.sqlite3
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/maluruthes/hub-projetos-neo.git
cd hub-projetos-neo
```

### 2. Configurar o backend

Entre na pasta do backend:

```bash
cd backend
```

Crie e ative um ambiente virtual:

```bash
python3 -m venv venv
source venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Aplique as migrações:

```bash
python manage.py migrate
```

Inicie o servidor:

```bash
python manage.py runserver
```

O backend ficará disponível em:

http://127.0.0.1:8000/

### 3. Configurar o frontend

Abra um segundo terminal na raiz do projeto:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm run dev
```

O frontend ficará disponível no endereço apresentado pelo Vite, normalmente:

http://localhost:5173/

## Funcionalidades

- Visualização e gerenciamento de projetos.
- Cadastro e consulta de membros.
- Pesquisa e filtragem de projetos.
- Limpeza dos filtros de pesquisa.
- Autenticação de usuários com JWT.
- Controle de acesso por perfil.
- Painel administrativo.
- Criação, edição, ativação e exclusão de usuários.

## Banco de dados

O projeto utiliza SQLite. O arquivo `backend/db.sqlite3` está incluído no repositório para facilitar a avaliação da aplicação.

As migrações do Django também estão disponíveis no projeto.

## Acesso administrativo

O painel administrativo da aplicação é restrito a usuários com perfil de administrador.

Caso seja necessário criar um novo administrador, execute:

```bash
python manage.py createsuperuser
```

Para acessar o painel administrativo do Django, utilize:

http://127.0.0.1:8000/admin/

## Observações

- O backend e o frontend devem permanecer em execução em terminais separados.
- As dependências do frontend e backend devem ser instaladas antes da execução.
- O banco de dados fornecido contém os dados disponíveis para avaliação da aplicação.
