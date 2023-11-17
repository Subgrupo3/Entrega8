const express = require('express');
const app = express();
const port = 3000;

// Configurar Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Rutas para los archivos JSON
app.get('/categorias', (req, res) => {
  res.sendFile(__dirname + '/Apis/cats/cat.json');
});

app.get('/comprar', (req, res) => {
    res.sendFile(__dirname + '/Apis/cart/buy.json');
});

app.get('/publicar', (req, res) => {
    res.sendFile(__dirname + '/Apis/sell/publish.json');
});

// Rutas dinámicas para categorías de productos
const categories = ['autos', 'juguetes', 'muebles', 'herramientas', 'computadoras', 'vestimenta', 'electrodomesticos', 'deporte', 'celulares'];
categories.forEach(category => {
  app.get(`/categorias/${category}`, (req, res) => {
    const categoryId = categories.indexOf(category) + 101;
    res.sendFile(`${__dirname}/Apis/cats_products/${categoryId}.json`);
  });

  // Rutas dinámicas para productos dentro de categorías
  app.get(`/categorias/${category}/:id`, (req, res) => {
    const productId = req.params.id;
    const productFilePath = `${__dirname}/Apis/products/${productId}.json`;

    // Cargar el producto
    const product = require(productFilePath);

    // Verificar si hay un archivo de comentarios para este producto
    const commentsFilePath = `${__dirname}/Apis/products_comments/${productId}.json`;

    try {
      // Cargar los comentarios si el archivo existe
      const comments = require(commentsFilePath);
      
      // Agregar los comentarios al objeto del producto
      product.comments = comments;

      // Enviar el producto con comentarios
      res.json(product);
    } catch (error) {
      // Si hay un error al cargar los comentarios, enviar el producto sin comentarios
      res.json(product);
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
