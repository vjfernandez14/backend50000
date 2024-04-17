const form = document.getElementById('resetForm')

form.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(form)
    console.log(data)   
    const obj = {}
    const tokenInput = document.getElementById('token');
    const token = tokenInput.value;

    data.forEach((value,key) => (obj[key] = value))

    const fetchParams = {  
        url: `http://localhost:8080/api/users/login/forgot/${token}`,
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