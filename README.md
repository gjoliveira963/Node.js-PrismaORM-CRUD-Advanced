# Node.js + PrismaORM + CRUD + Advanced

Este projeto demonstra recursos avançados do Prisma ORM com operações CRUD
complexas, relacionamentos sofisticados e padrões profissionais de banco de
dados.

🎯 **Introdução** Implementação avançada com Prisma ORM contendo:

- Modelagem profissional de dados
- Relacionamentos complexos (1:1, 1:N, N:N)
- Transações ACID
- Operações em cascata
- Consultas otimizadas com joins
- Seed de dados automatizado
- Boas práticas de ORM

📋 **Pré-requisitos**

- Node.js 20.x+
- npm 10.x+
- PostgreSQL 15+ (Ou outro Sistema Gerenciador de Banco de Dados)
- Git

🚀 **Instalação Rápida**

```bash
git clone https://github.com/gjoliveira963/Node.js-PrismaORM-CRUD-Advanced.git
cd Node.js-PrismaORM-CRUD-Advanced
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run start
```

🗄️ **Estrutura do Banco de Dados**

Modelagem completa no `schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  movies    Movie[]
  // ... outros campos
}

model Movie {
  id          Int
  title       String
  director    Director?
  categories  CategoryAndMovie[]
  detail      MovieDetail @relation(...)
  // ... relações completas
}

model Category {
  id        Int
  name      String @unique
  movies    CategoryAndMovie[]
}

// Modelo de junção N:N
model CategoryAndMovie {
  category   Category
  movie      Movie
  // ... campos compostos
}
```

## ⚙️ **Operações Avançadas**

### Criação com Relações Aninhadas

```typescript
const user = await prisma.user.create({
  data: {
    name: "Cinéfilo João",
    movies: {
      create: [
        {
          title: "O Retorno do Jedi Espacial",
          detail: { create: { duration: 150 } },
          director: { create: { name: "Lucas Arthuro" } },
          categories: {
            create: [
              { category: { create: { name: "Ficção Científica" } } },
              { category: { create: { name: "Aventura" } } },
            ],
          },
        },
      ],
    },
  },
});
```

### Transação com Múltiplas Operações

```typescript
const [newDetail, category] = await prisma.$transaction([
  prisma.movieDetail.create({ data: { ... }}),
  prisma.category.upsert({ where: { name: "Comédia" }, ... })
]);

const newMovie = await prisma.movie.create({
  data: {
    detailId: newDetail.id,
    categories: { create: { categoryId: category.id } }
  }
});
```

### Consulta Complexa com Joins

```typescript
const sciFiMovies = await prisma.categoryAndMovie.findMany({
  where: { category: { name: "Ficção Científica" } },
  include: {
    movie: {
      include: { detail: true, user: true },
    },
  },
});
```

## 🔄 **Fluxo de Desenvolvimento**

1. Modificar o `schema.prisma`
2. Gerar migrações:

```bash
npx prisma migrate dev --name [descrição]
```

3. Testar operações no `main.ts`
4. Executar com:

```bash
npm run start
```

📊 **Relacionamentos Mapeados**

| Entidade         | Relacionamento | Tipo         |
| ---------------- | -------------- | ------------ |
| User ↔ Movie     | 1:N            | One-to-Many  |
| Movie ↔ Detail   | 1:1            | One-to-One   |
| Movie ↔ Category | N:N            | Many-to-Many |
| Director ↔ Movie | 1:N            | One-to-Many  |

⚠️ **Boas Práticas**

- Sempre usar transações para operações críticas
- Utilizar `connectOrCreate` para evitar duplicações
- Preferir deleção lógica quando possível
- Validar dados antes de persistir
- Utilizar índices para campos de busca frequentes

## 🌟 **Funcionalidades Destacadas**

### Atualização em Cascata

```typescript
await prisma.movie.update({
  where: { id: movieId },
  data: {
    director: { connect: { id: newDirectorId } },
  },
});
```

### Deleção Condicional

```typescript
await prisma.$transaction([
  prisma.categoryAndMovie.deleteMany({ ... }),
  prisma.director.delete({ where: { id: directorId } })
]);
```

### Consulta com Agregação

```typescript
const directors = await prisma.director.findMany({
  include: { _count: { select: { movies: true } } },
});
```

## 📊 **Seed de Dados Inicial**

O arquivo `main.ts` inclui um sistema completo de seed com:

- Criação de usuário com filmes relacionados
- Setup de categorias e diretores
- Exemplos de transações
- Demonstração de relações N:N

Execute com:

```bash
npm run start
```

## 📚 **Documentação Adicional**

- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Transaction API](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Advanced Query Techniques](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prisma-client/advanced-query)

---

Explore as capacidades completas do Prisma ORM com esta implementação de
referência! 🚀
