import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  console.log("✅ Conectado ao banco de dados");

  // 🧹 Limpeza de dados existentes
  console.log("🧹 Limpando dados do banco...");
  await prisma.user.deleteMany();
  await prisma.categoryAndMovie.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.movieDetail.deleteMany();
  await prisma.director.deleteMany();
  await prisma.category.deleteMany();
  console.log("✔️ Dados existentes limpos.");

  // 1️⃣ Criação de dados iniciais com relações complexas
  console.log("\n🔧 Criando usuário e filmes...");
  const user = await prisma.user.create({
    data: {
      name: "Cinéfilo João",
      email: "joao@cinema.com",
      movies: {
        create: [
          {
            title: "O Retorno do Jedi Espacial",
            releaseDate: new Date("2023-05-15"),
            detail: {
              create: {
                duration: 150,
                description: "Uma épica aventura espacial",
              },
            },
            director: {
              create: {
                name: "Lucas Arthuro",
              },
            },
            categories: {
              create: [
                {
                  category: {
                    create: {
                      name: "Ficção Científica",
                    },
                  },
                },
                {
                  category: {
                    create: {
                      name: "Aventura",
                    },
                  },
                },
              ],
            },
          },
          {
            title: "O Segredo do Vale",
            releaseDate: new Date("2024-01-20"),
            detail: {
              create: {
                duration: 135,
                description: "Drama emocionante em ambiente rural",
              },
            },
            categories: {
              create: [
                {
                  category: {
                    connectOrCreate: {
                      where: { name: "Drama" },
                      create: { name: "Drama" },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      movies: {
        include: {
          detail: true,
          director: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  console.log("✔️ Usuário criado com filmes relacionados:");
  console.dir(user, { depth: null });

  // 2️⃣ Consultas complexas
  console.log("\n🔍 Consultas complexas...");

  // a) Buscar usuário com filmes, detalhes, diretores e categorias
  const userWithMovies = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      movies: {
        include: {
          detail: true,
          director: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  console.log("✔️ Usuário com todos os relacionamentos:");
  console.dir(userWithMovies, { depth: null });

  // b) Buscar filmes de uma categoria específica
  const sciFiMovies = await prisma.categoryAndMovie.findMany({
    where: {
      category: {
        name: "Ficção Científica",
      },
    },
    include: {
      movie: {
        include: {
          detail: true,
          user: true,
        },
      },
    },
  });

  console.log("✔️ Filmes de Ficção Científica:");
  console.dir(sciFiMovies, { depth: null });

  // c) Contar filmes por diretor
  const directorsWithCount = await prisma.director.findMany({
    include: {
      _count: {
        select: { movies: true },
      },
    },
  });

  console.log("✔️ Diretores com contagem de filmes:");
  console.dir(directorsWithCount, { depth: null });

  // 3️⃣ Atualizações complexas
  console.log("\n🔄 Atualizações complexas...");

  // a) Adicionar nova categoria a um filme
  const updatedMovie = await prisma.movie.update({
    where: { id: user.movies[0].id },
    data: {
      categories: {
        create: {
          category: {
            connectOrCreate: {
              where: { name: "Ação" },
              create: { name: "Ação" },
            },
          },
        },
      },
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  console.log("✔️ Filme com nova categoria adicionada:");
  console.dir(updatedMovie, { depth: null });

  // b) Atualizar diretor de um filme
  const newDirector = await prisma.director.create({
    data: { name: "Spielbergson" },
  });

  const movieWithNewDirector = await prisma.movie.update({
    where: { id: user.movies[0].id },
    data: {
      director: {
        connect: { id: newDirector.id },
      },
    },
    include: {
      director: true,
    },
  });

  console.log("✔️ Filme com novo diretor:");
  console.dir(movieWithNewDirector, { depth: null });

  // 4️⃣ Transações
  console.log("\n💳 Realizando transações...");
  const [newDetail, comedyCategory] = await prisma.$transaction([
    prisma.movieDetail.create({
      data: {
        duration: 125,
        description: "Nova comédia romântica",
      },
    }),
    prisma.category.upsert({
      where: { name: "Comédia" },
      update: {},
      create: { name: "Comédia" },
    }),
  ]);

  const newMovie = await prisma.movie.create({
    data: {
      title: "Amor em Alto Mar",
      releaseDate: new Date(),
      detailId: newDetail.id,
      userId: user.id,
      categories: {
        create: {
          categoryId: comedyCategory.id,
        },
      },
    },
    include: {
      detail: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  console.log("✔️ Novo filme criado via transação:");
  console.dir(newMovie, { depth: null });

  // 5️⃣ Exclusões e efeitos em cascata
  console.log("\n🗑️ Gerenciando exclusões...");

  // a) Remover categoria de um filme
  await prisma.categoryAndMovie.deleteMany({
    where: {
      movieId: user.movies[0].id,
      category: {
        name: "Ação",
      },
    },
  });

  // b) Deletar diretor e verificar efeito nos filmes
  const directorToDelete = await prisma.director.findFirst({
    where: { name: "Lucas Arthuro" },
  });

  if (directorToDelete) {
    await prisma.director.delete({
      where: { id: directorToDelete.id },
    });

    const affectedMovie = await prisma.movie.findUnique({
      where: { id: user.movies[0].id },
      select: { director: true },
    });

    console.log("✔️ Filme após deletar diretor:");
    console.dir(affectedMovie, { depth: null });
  }

  // Consulta final
  const finalUserData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      movies: {
        include: {
          detail: true,
          director: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  console.log("\n✔️ Estado final do usuário:");
  console.dir(finalUserData, { depth: null });
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔒 Desconectado do banco de dados");
  });
