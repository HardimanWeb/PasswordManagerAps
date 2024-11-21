document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const cpassword = document.querySelector('input[name="cpassword"]').value;
 
    // const key = generateKey();
    // // Enkripsi username, email, dan password
    // const encryptedUsername = vigenereEncrypt(username, key);
    // const encryptedEmail = vigenereEncrypt(email, key);
    // const encryptedPassword = vigenereEncrypt(password, key);
    // const encryptedcPassword = vigenereEncrypt(cpassword, key);

    // Kirim data ke API menggunakan fetch
    try {
      const response = await fetch('http://localhost:5000/accounts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, cpassword })
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'User registered successfully.',
          showConfirmButton: false,
          timer: 1500
        }).then(function() { 
             Swal.fire({
          title: "Hasil Enkripsi",
          html: `
          <br><br> <p><strong>Password:</strong> ${result.data.data.password_asli}</p><br>
          <p><strong>Hasil Enkripsi:</strong> ${result.data.data.password_enkripsi}</p><br>
          <p><strong>Hasil Dekripsi:</strong> ${result.data.data.password_dekripsi}</p><br>
        `,
        // timer: 1500,
          showConfirmButton: false, 
          allowOutsideClick: true, 
        }).then(function() {
          console.log(result.data.data)
          window.location.href = 'login.html';
        });
        });
        // alert(result.message);
      } else {
        Swal.fire({
          icon: "error",
          title: "Faill...",
          text: (result.message || 'Failed to register Username atau Email sudah ada' ),
          footer: ''
        });
        // alert(result.message || 'Failed to register Username atau Email sudah ada');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server');
    }
});;

