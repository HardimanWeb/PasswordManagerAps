
  document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Kirim data ke API menggunakan fetch
    try {
      const response = await fetch('http://localhost:5000/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: (result.message),
          showConfirmButton: false,
          timer: 1500
        }).then(function() {
          window.location.href = 'home.html';
        });
        // Simpan token ke local storage 
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.id);  // Simpan id user
      } else {
        Swal.fire({
          icon: "error",
          title: "Faill...",
          text: (result.message || 'Failed to login' ),
          footer: ''
        });
        // alert(result.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server');
    }
  });
