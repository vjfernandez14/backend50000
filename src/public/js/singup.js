const form = document.getElementById('singupForm')

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)
    const obj = {}

    data.forEach((value, key) => (obj[key] = value))

    const fetchParams = {
        url: '/api/users/singup',
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(obj),
    }

    fetch(fetchParams.url, {
        headers: fetchParams.headers,
        method: fetchParams.method,
        body: fetchParams.body,
    })
        .then(response => response.json())
        .then(data => {
            // Mostrar SweetAlert2 cuando la solicitud sea exitosa
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: '¡El usuario se ha registrado correctamente!',
            });
            console.log(data);
        })
        .catch(error => {
            // Mostrar SweetAlert2 en caso de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema durante el registro. Por favor, inténtalo de nuevo.',
            });
            console.log(error);
        });
});
