const express = require('express');

const jwt = require("jsonwebtoken");
const SECRET_KEY = "CLAVE";

const app = express();
const port = 3000;

app.use(express.json());

// Configurar Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Auth
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username }, SECRET_KEY);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Usuario y/o contraseña incorrecto" });
  }
});

// Rutas para los archivos JSON
app.get('/categorias', (req, res) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);
    res.sendFile(__dirname + '/Apis/cats/cat.json');
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
});

app.get('/comprar', (req, res) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);
    res.sendFile(__dirname + '/Apis/cart/buy.json');
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
});

app.get('/publicar', (req, res) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);
    res.sendFile(__dirname + '/Apis/sell/publish.json');
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
});

// Rutas dinámicas para categorías de productos
const categories = ['autos', 'juguetes', 'muebles', 'herramientas', 'computadoras', 'vestimenta', 'electrodomesticos', 'deporte', 'celulares'];
categories.forEach(category => {
  app.get(`/categorias/${category}`, (req, res) => {
    try {
      const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
      console.log(decoded);
      const categoryId = categories.indexOf(category) + 101;
      res.sendFile(`${__dirname}/Apis/cats_products/${categoryId}.json`);
    } catch (err) {
      res.status(401).json({ message: "Usuario no autorizado" });
    }
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
      const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
      console.log(decoded);
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
    } catch (err) {
        res.status(401).json({ message: "Usuario no autorizado" });
    }
  });
});

app.get(`/cart`, (req, res) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);
    res.sendFile(__dirname + '/Apis/user_cart/25801.json');
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
});

app.post(`/cart`, (req, res) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);

    const cart = require(__dirname + `/Apis/user_cart/25801.json`);

    // Agregar el nuevo artículo al carrito
    const newArticle = req.body;
    cart.articles.push(newArticle);

    // Guardar el carrito actualizado en el archivo
    fs.writeFileSync(__dirname + `/Apis/user_cart/25801.json`, JSON.stringify(cart, null, 2));

    res.status(200).json({ message: 'Producto agregado al carrito exitosamente' });
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
