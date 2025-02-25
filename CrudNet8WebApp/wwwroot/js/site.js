document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#productForm");
    const tableBody = document.querySelector("#productsTable");
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (tableBody) loadProducts();
    if (form) {
        if (id) loadProduct(id);
        form.addEventListener("submit", (e) => saveProduct(e, id));
    }
});

async function loadProducts() {
    const response = await fetch("/api/Product");
    const products = await response.json();
    const tableBody = document.querySelector("#productsTable");
    tableBody.innerHTML = products.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>
                <a href="edit.html?id=${p.id}" class="btn btn-warning btn-sm">Editar</a>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

async function loadProduct(id) {
    const response = await fetch(`/api/Product/${id}`);
    const product = await response.json();
    document.querySelector("#productId").value = product.id;
    document.querySelector("#name").value = product.name;
    document.querySelector("#price").value = product.price;
}

async function saveProduct(e, id) {
    e.preventDefault();
    const product = {
        name: document.querySelector("#name").value,
        price: parseFloat(document.querySelector("#price").value)
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/Product/${id}` : "/api/Product";
    if (id) product.id = parseInt(id);

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });

    window.location.href = "products.html";
}

async function deleteProduct(id) {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
        await fetch(`/api/Product/${id}`, { method: "DELETE" });
        loadProducts();
    }
}
