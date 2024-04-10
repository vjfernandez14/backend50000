const form = document.getElementById('forgotForm')

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)
    console.log(data)   
    const obj = {}

    data.forEach((value,key) => (obj[key] = value))

    const fetchParams = {
        url: '/api/users/login/forgot',
        headers: {
            'content-type':'application/json',
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
    .then(data => console.log(data))
    .catch(error => console.log(error))
})