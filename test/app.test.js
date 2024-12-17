const request = require("supertest");
const { app } = require("../app");
const { sequelize } = require("../models/database");
const { Produto } = require("../models/produto");
const { Categoria } = require("../models/categoria");
const { Estoque } = require("../models/estoque");

beforeAll(async () => {
    await sequelize.sync({ force: true });
    const categoria = await Categoria.create({ nome: "Eletrônicos" });
    const produto = await Produto.create({ nome: "Celular", preco: 1200.0, quantidade: 50, categoriaId: categoria.id });
    await Estoque.create({ produtoId: produto.id, quantidade: 50 });
    console.log("Banco sincronizado!")
  });
  
afterAll(async () => {
    await sequelize.close(); 
  });

  describe("Testes de integração com o banco de dados em memória do SQLITE3", () => {
    
    it("Deve listar todos as categorias (GET /categoria)", async () => {
      const response = await request(app).get("/api/categoria");
      expect(response.status).toBe(200);
    
    });
   it("Deve uma nova categoria (POST /categoria)", async () => {
      const response = await request(app)
      .post('/api/categoria')
      .send({ nome: 'teste3' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('teste3');
    });
    it("Deve atualizar uma categoria (PUT /categoria/:id)", async () => {
      const novoNome = "Outro";
  
      const categoria = await Categoria.create({ nome: novoNome});
      const response = await request(app)
        .put(`api/categoria/${categoria.id}`)
        .send({ nome: "Variedade2"});
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.nome).toBe("Variedade2");

    });
    it("Deve deletar uma categoria (DELETE /categoria/:id)", async () => {
      const categoria = await Categoria.create({ nome: 'Tecnologia' });
    
      const response = await request(app)
        .delete(`/api/categoria/${categoria.id}`)
        .send();
    
      expect(response.status).toBe(204);
    
      const categoriaDeletada = await Categoria.findByPk(categoria.id);
      expect(categoriaDeletada).toBeNull();
    });
    it("Deve listar todos os produtos (GET /produto)", async () => {
      const response = await request(app).get("/api/produto");
      expect(response.status).toBe(200);
    
    });
   it("Deve adicionar um novo produto (POST /produto)", async () => {
      const response = await request(app)
      .post('/api/produto')
      .send({ nome: "Computador", preco: 2000.0, quantidade: 10, categoriaId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Computador');
    });
    it("Deve atualizar um produto (PUT /produto/:id)", async () => {
   
      const produto = await Produto.create({ nome: 'HD', preco: 100.0, quantidade: 1, categoriaId: 1  });
      const response = await request(app)
        .put(`api/produto?id={${produto.id}}`)
        .send({ nome: 'HD', preco: 200.0, quantidade: 1, categoriaId: 1 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('HD');

    });
    it("Deve deletar um produto (DELETE /produto/:id)", async () => {
      const produto = await Produto.create({ nome: 'HD', preco: 100.0, quantidade: 1, categoriaId: 1 });
    
      const response = await request(app)
        .delete(`/api/produto?id=${produto.id}`)
        .send();
    
      expect(response.status).toBe(200);
        
      const produtoDeletado = await Produto.findByPk(produto.id);
      expect(produtoDeletado).toBeNull();
    });

    it("Deve listar o registo de estoque (GET /estoque)", async () => {
      const response = await request(app).get("/api/produto");
      expect(response.status).toBe(200);
    
    });
   it("Deve adicionar um novo estoque /produto)", async () => {
      const response = await request(app)
      .post('/api/produto')
      .send({ nome: "Computador", preco: 2000.0, quantidade: 10, categoriaId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('Computador');
    });
    it("Deve atualizar um estoque (PUT /produto/:id)", async () => {
   
      const produto = await Produto.create({ nome: 'HD', preco: 100.0, quantidade: 1, categoriaId: 1  });
      const response = await request(app)
        .put(`api/produto?id={${produto.id}}`)
        .send({ nome: 'HD', preco: 200.0, quantidade: 1, categoriaId: 1 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('HD');

    });

  });