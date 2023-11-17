// Archivo: init.js

// Función para obtener productos de una categoría específica
function getProductos(categoria) {
    fetch(`http://localhost:3000/categorias/${categoria}`)
      .then(response => response.json())
      .then(data => {
        console.log(`Productos en la categoría ${categoria}:`, data);
        // Aquí puedes hacer más cosas con los datos, como renderizarlos en tu interfaz de usuario
      })
      .catch(error => console.error(error));
  }
  
  // Función para obtener un producto específico por su ID
  function getProductoPorID(categoria, productoID) {
    fetch(`http://localhost:3000/categorias/${categoria}/${productoID}`)
      .then(response => response.json())
      .then(data => {
        console.log(`Detalles del producto ${productoID} en la categoría ${categoria}:`, data);
        // Aquí puedes hacer más cosas con los datos, como mostrar detalles en tu interfaz de usuario
      })
      .catch(error => console.error(error));
  }
  
  // Ejemplos de uso
  getProductos('autos');
  getProductoPorID('autos', 101);
  