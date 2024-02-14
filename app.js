const itemsContainer = document.getElementById('items');
const carritoContainer = document.getElementById('carrito');
const footer = document.getElementById('footer');

const templateCard = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    // Listener para vaciar el carrito
    document.getElementById('vaciar-carrito').addEventListener('click', () => {
        carrito = {};
        pintarCarrito();
        // Actualizar el total de productos en el footer
        pintarFooter();
    });
});

itemsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('btn-dark')) {
        const item = e.target.parentElement.parentElement;
        setCarrito(item);
    }
});

carritoContainer.addEventListener('click', e => {
    if (e.target.classList.contains('btn-info')) {
        btnAumentarDisminuir(e);
    } else if (e.target.classList.contains('btn-danger')) {
        btnAumentarDisminuir(e);
    }
});




const fetchData = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        mostrarProductos(data);
    } catch (error) {
        console.log(error);
    }
};

const mostrarProductos = (data) => {
    data.forEach((producto) => {
        templateCard.querySelector('h5').textContent = producto.title;
        templateCard.querySelector('p').textContent = `$${producto.precio.toFixed(2)}`;
        templateCard.querySelector('img').src = producto.thumbnailUrl;
        templateCard.querySelector('.btn-dark').dataset.id = producto.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    itemsContainer.appendChild(fragment);
};

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: parseFloat(objeto.querySelector('p').textContent.slice(1)),
        cantidad: 1
    };

    if (carrito.hasOwnProperty(producto.id)) {
        carrito[producto.id].cantidad++;
    } else {
        carrito[producto.id] = { ...producto };
    }

    pintarCarrito();
};

const pintarCarrito = () => {
    carritoContainer.innerHTML = '';
    fragment.innerHTML = ''; // Limpiar fragmento

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id;
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
        templateCarrito.querySelector('span').textContent = `$${(producto.precio * producto.cantidad).toFixed(2)}`;

        const btnAumentar = templateCarrito.querySelector('.btn-info');
        const btnDisminuir = templateCarrito.querySelector('.btn-danger');

        btnAumentar.dataset.id = producto.id;
        btnDisminuir.dataset.id = producto.id;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    carritoContainer.appendChild(fragment);

    pintarFooter();
};

const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
        `
        return
    }
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}
const btnAumentarDisminuir = e => {
    const productoId = e.target.dataset.id;

    if (e.target.classList.contains('btn-info')) {
        carrito[productoId].cantidad++;
    } else if (e.target.classList.contains('btn-danger')) {
        if (carrito[productoId].cantidad > 1) {
            carrito[productoId].cantidad--;
        } else {
            delete carrito[productoId];
        }
    }

    pintarCarrito();
};