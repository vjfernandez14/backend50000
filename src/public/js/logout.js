const logoutButton = document.getElementById('logout')

logoutButton.addEventListener('click', e => {
  console.log('logout')
  fetch('/api/users/login/logout')
    .then(response => response.text()) 
    .then(formData => {
        console.log(formData)
        if(formData === 'success')
        console.log('paso por aca')
      window.location.href = '/api/users/login'
    }).catch(error => {
      const err = error
      console.log(err)
    })  
})