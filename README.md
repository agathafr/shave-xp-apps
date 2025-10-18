# 🪒 Shave XP – API & Web

Este repositório contém as aplicações **backend (API)** e **frontend (Web)** do projeto **Shave XP**.  
A API foi construída em **Node.js** com **TypeORM** e banco de dados **PostgreSQL (Aiven)**.  
O frontend é uma aplicação **React.js** (porta padrão: 3000).

---

## ⚙️ Estrutura do Projeto

```
/
├─ api/              # Backend principal
│  ├─ ormconfig.js
│  ├─ ormconfig.seeds.js
│  ├─ package.json
│  └─ .env.example
└─ web/              # Aplicação web
   ├─ package.json
   └─ .env.example
```

---

## 🧰 Pré-requisitos

- Node.js (versão LTS)
- Git
- PostgreSQL hospedado (ex.: Aiven)
- VSCode (recomendado)

---

## 🚀 Passos para execução

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/seu-usuario/shave-xp-apps.git
cd shave-xp-apps
```

---

### 2️⃣ Configurar e rodar a API

```bash
cd api
cp .env.example .env
npm install
```

#### ⚙️ Exemplo de `.env`
```bash
POSTGRES_HOST=shavexp-xxxxxxx.aivencloud.com
POSTGRES_PORT=********
POSTGRES_USER=********
POSTGRES_PASS=********
POSTGRES_NAME=********
POSTGRES_SSL=true
```

> ⚠️ **Atenção:** o SSL é obrigatório no Aiven.  
> No `ormconfig.js`, o campo deve conter:
> ```js
> ssl: { rejectUnauthorized: false }
> ```

---

### 3️⃣ Criar e popular o banco de dados

Execute os dois comandos a seguir **dentro da pasta `/api`**:

```bash
npm run db:init       # Executa as migrações
npm run db:populate   # Executa as seeds (dados iniciais)
```

#### 💡 O que cada comando faz:
- `db:init` → Cria as tabelas conforme as entidades/migrações.  
- `db:populate` → Insere dados iniciais (usuários, permissões, etc.), necessários para que o app e os testes Cypress funcionem.

> ✅ Ao final, você deverá ver mensagens como:
> ```
> query: START TRANSACTION
> query: COMMIT
> ```

---

### 4️⃣ Rodar a API localmente

```bash
npm run dev
```

O servidor será iniciado na porta **3333**.  
Você pode testar com:

```bash
curl http://localhost:3333/
```

---

### 5️⃣ Rodar a aplicação Web

```bash
cd ../web
cp .env.example .env
npm install
npm start
```

#### 🧩 Exemplo de `.env`
```bash
APP_API_URL=http://localhost:3333
```

A aplicação ficará disponível em:  
👉 http://localhost:3000  

---

## 📧 Configuração de envio de e-mails (Ethereal ou Mailtrap)

Para que o endpoint `/password/forgot` funcione corretamente, é necessário configurar um **serviço SMTP**.  
A API utiliza o **Nodemailer** e suporta **Ethereal** (recomendado para ambiente de testes) ou **Mailtrap**.

### 🔹 Opção 1 – Ethereal (recomendada para desenvolvimento/testes)

O Ethereal cria uma conta temporária automaticamente e armazena o e-mail gerado em uma inbox acessível via link.

#### Passos:

1. Acesse [https://ethereal.email/create](https://ethereal.email/create)  
2. Crie uma conta temporária e copie os dados de acesso (host, port, user, pass).  
3. No projeto da API, adicione no arquivo `.env`:

```bash
MAIL_DRIVER=ethereal
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=SEU_USUARIO_ETHEREAL
MAIL_PASS=SUA_SENHA_ETHEREAL
MAIL_FROM='"Shave XP" <no-reply@shavexp.com>'
```

4. Reinicie a API com `npm run dev`.

Após enviar o e-mail de recuperação, o link de visualização aparecerá no log do servidor da API, algo como:

```
E-mail enviado: https://ethereal.email/message/WaQKMgKddxQDoou...
```

Você pode acessar esse link para validar o conteúdo do e-mail.

---

### 🔹 Opção 2 – Mailtrap (alternativa)

Caso prefira, configure uma conta gratuita no [Mailtrap](https://mailtrap.io).  
No `.env` da API:

```bash
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=SEU_USER_MAILTRAP
MAIL_PASS=SEU_PASS_MAILTRAP
MAIL_FROM='"Shave XP" <no-reply@shavexp.com>'
```

---

### 🧠 Dica para ambiente de teste

Se quiser **desativar o envio real** durante os testes automatizados, adicione no `.env` da API:

```bash
DISABLE_MAIL=true
```

E ajuste a rota `/password/forgot` para retornar **204** sem tentar enviar o e-mail quando essa variável estiver ativa:

```js
if (process.env.DISABLE_MAIL === 'true') {
  return res.status(204).end()
}
```

Assim o fluxo de recuperação de senha funciona sem depender de um servidor SMTP.

---

## 🧱 Scripts principais

### `api/package.json`
```json
"scripts": {
  "dev": "cross-env DOTENV_CONFIG_PATH=./.env node -r dotenv/config dist/shared/infra/http/server.js",
  "db:init": "cross-env NODE_ENV=development DOTENV_CONFIG_PATH=./.env node -r dotenv/config ./node_modules/typeorm/cli.js --config ormconfig.js migration:run",
  "db:populate": "cross-env NODE_ENV=development DOTENV_CONFIG_PATH=./.env node -r dotenv/config ./node_modules/typeorm/cli.js --config ormconfig.seeds.js migration:run",
  "db": "npm run db:init && npm run db:populate"
}
```

---

## 💡 Solução de problemas comuns

| Erro | Causa provável | Solução |
|------|----------------|----------|
| `ENOTFOUND ?` | `.env` não lido corretamente | Use `DOTENV_CONFIG_PATH=./.env` |
| `no pg_hba.conf entry ...` | SSL ausente | Adicione `ssl: { rejectUnauthorized: false }` |
| `Missing script: db:init` | Comando executado fora de `/api` | Navegue até `/api` antes de rodar |
| `relation "users" does not exist` | Seeds executadas antes das migrações | Rode `npm run db:init` antes de `npm run db:populate` |
| Porta 3333 ocupada | Outro processo em execução | Finalize o processo ou mude a porta |

---

## 🧾 Observação

Esta API é usada pelos testes automatizados Cypress disponíveis em outro repositório:  
🔗 [shave-xp-tests](https://github.com/seu-usuario/shave-xp-tests)

---

## ✅ Conclusão

Após clonar o repositório, configurar o `.env` (incluindo o e-mail), instalar as dependências e popular o banco, você poderá executar o backend e o frontend localmente, com suporte completo aos fluxos da aplicação e ao envio de e-mails.
