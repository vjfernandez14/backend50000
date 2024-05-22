document.addEventListener('DOMContentLoaded', () => {
    const guardarRolBtn = document.getElementById('guardarRolBtn');
    const updateRoleForm = document.getElementById('updateRoleForm');
    const roleSelect = document.getElementById('role');

    guardarRolBtn.addEventListener('click', () => {
        const newRole = roleSelect.value; 

        
        const newRoleField = document.createElement('input');
        newRoleField.type = 'hidden';
        newRoleField.name = 'newRole';
        newRoleField.value = newRole;

        
        updateRoleForm.appendChild(newRoleField);

        
        updateRoleForm.submit();
    });
});


// Event listener para eliminar un usuario
document.getElementById('eliminarUsuarioBtn').addEventListener('click', async () => {
    const uid = document.getElementById('userId').value; // Obtener el id del usuario

    try {
        const response = await fetch(`/admin/users/${uid}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); // Mensaje de éxito
        } else {
            console.error('Error al eliminar el usuario:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
    }
});
