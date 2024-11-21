const userId = localStorage.getItem('userId');
document.getElementById('userId').textContent = userId;
// console.log(userId);
const apiUrl = `http://localhost:5000/accounts/${userId}`;
let skor = false;

// Cek  token ada
const token = localStorage.getItem('token');
if (!token) {
  // Jika tidak ada token, arahkan ke halaman login
  window.location.href = 'login.html';
}

// menampilkan data akun di home
const fetchingData = () => {
    fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Data not found');
        } else if (response.status === 500) {
          throw new Error('Server error');
        } else {
          throw new Error('Network response was not ok');
        }
      }
      return response.json();
    })
    .then(data => {
      let datas = data[0].payload;
    //   console.log(datas);
    let n = 0;
    let m = 0;
    let k = 0;
  
   for (const dataItem of datas ) {
     // membuat elemen data dr database
     const id_account = document.createElement("p");
     const service_name = document.createElement('h2');
     const kategori = document.createElement('p');
     const username = document.createElement('p');
     const password = document.createElement('p');
     const article_id = document.createElement('p');
     const anchor = document.createElement('a');
     const action = document.createElement('div');
     action.classList.add('action');
     const showButton = document.createElement('button');
     const removeButton = document.createElement('button');
     const editButton = document.createElement('button');
    
   //  membuat container elemen dari data
   const container = document.createElement('article');
   container.classList.add('book_item');

//    menambahkan elemen id pada elemen
   id_account.id = 'id_account'; 
   article_id.id = 'article_id';
   service_name.id = 'service_name'; 
   username.id = ('username_label' + (++n)); 
   password.id = ('password_label' + (++m)); 
   kategori.id = ('kategori_label' + (++k)); 
  showButton.classList.add('green');
  removeButton.classList.add('red');
  editButton.classList.add('orange');
  editButton.append(anchor);
  anchor.setAttribute('href', '#');
  // showButton.setAttribute('onclick', 'showBtn');

   container.append(id_account,service_name, username, password, kategori,article_id);
   container.append(action);
   const accountElement = container;
   action.append(showButton,removeButton,editButton);
  // console.log(dataItem);
  managerPasswordList.append(accountElement);

  let api_id_account = dataItem.id
  let api_service_name = dataItem.service_name;
  let api_username = dataItem.service_username;
  let api_password = dataItem.service_password;
  let api_kategori = dataItem.category;
     
  // menampilkan data dr database ke elemen frontEnd
  article_id.innerText = n;
  let id_artikel = article_id.innerText;
  id_account.innerText = api_id_account;
  service_name.innerText = api_service_name;
  username.innerText = ("Username : " + api_username);
  password.innerText = ("Password : " + api_password);
  kategori.innerText = ("Kategori : " + api_kategori);
  showButton.innerText="Tampilkan Password";
  removeButton.innerText="Hapus List Akun";
  anchor.innerText="Edit List Akun";

   editButton.addEventListener('click', function () {
    editListAccount(api_id_account);
   });
  showButton.addEventListener('click', function () { 
    showEncrypt(api_id_account, n, id_artikel);
   });
   removeButton.addEventListener('click', function () {
    deleteListAccount(api_id_account);
  });
 }
})
    .catch(error => {
      console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const searchForm = document.getElementById('searchBook');
  fetchingData();
  // alert("tes");
  searchForm.addEventListener('submit', function (event) {
    const inputcari = document.getElementById('searchTitle').value;
    search(inputcari.toLowerCase());
    event.preventDefault();
  });
});

function search(inputcari){
  const elementSearch = document.querySelectorAll('.book_item');
  
    for(let searchbook of elementSearch){
    const service_name = searchbook.childNodes[1];
    // console.log(judulBuku);
    
    if(!service_name.innerText.toLowerCase().includes(inputcari)){
       service_name.parentElement.style.display ='none';
    }
    else 
      service_name.parentElement.style.display ='';
    }
  }

// input account data baru
document.getElementById('inputAccount').addEventListener('submit', function(event) {
    event.preventDefault();  // Mencegah reload halaman

    // Ambil data dari form
    const service_name = document.getElementById('service_name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const category = document.getElementById('category').value;
    const id = document.getElementById('userId').textContent;

    // Buat object data untuk dikirim
    const data = {
        id: id,
        service_name: service_name,
        username: username,
        password: password,
        category: category
    };

    // Kirim data menggunakan Fetch API
    fetch('http://localhost:5000/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'User registered successfully.',
        showConfirmButton: true,
        timer: 1500
      }).then(function() {
        window.location.reload();
      });
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function  deleteListAccount (id) {
  Swal.fire({
    title: 'Anda Yakin?',
    text: "Anda tidak akan dapat mengembalikan Data ini!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete it!',
    timer: 3000,
  }).then((result) => {
    if (result.isConfirmed) { 
         // Kirim data menggunakan Fetch API
       fetch(`http://localhost:5000/accounts/${id}`, {
         method: 'DELETE',
         headers: {
         'Content-Type': 'application/json'
        },
      })
  .then(response => response.json())
  .then(data => {
      console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  }); 
      Swal.fire(
        'Deleted!',
        'Your Book has been deleted.',
        'success'
      )
      window.location.reload();
    }
  })
 }

function  editListAccount (id) {
    // Sembunyikan form input data
  document.getElementById("inputAccount").style.display = "none";
  document.getElementById("titleForm").innerText = "Isi Data Akun Yang Akan DiUpdate";
  // Tampilkan form update data
  const formUpdate = document.getElementById("inputUpdateAccount");
  formUpdate.style.display = "block";
    // const category = document.getElementById('');

        // Kirim permintaan ke server untuk mengambil data berdasarkan ID
        fetch(`http://localhost:5000/accounts/updates/${id}`)
        .then(response => response.json())
        .then(data => {
            let datas = data[0].payload;
            // console.log(datas);
            // Setelah data diterima, tampilkan di form
            document.getElementById('idUpdate').innerText = datas.id;
            document.getElementById('Update_service_name').value = datas.service_name;
            document.getElementById('update_username').value = datas.username_dekripsi.toLowerCase();
            document.getElementById('update_password').value = datas.password_dekripsi.toLowerCase();
            document.getElementById('update_category').value = datas.category;
        })
        .catch(error => {
            console.error('Error:', error);
        });
 }

 document.getElementById('inputUpdateAccount').addEventListener('submit', function(event) {
    event.preventDefault();  // Mencegah reload halaman

    // Ambil data dari form
    const service_name = document.getElementById('Update_service_name').value;
    const username = document.getElementById('update_username').value;
    const password = document.getElementById('update_password').value;
    const category = document.getElementById('update_category').value;
    const id = document.getElementById('idUpdate').textContent;


    // Buat object data untuk dikirim
    const data = {
        service_name: service_name,
        username: username,
        password: password,
        category: category
    };
    Swal.fire({
      title: "Kamu Yakin Ingin Mengubah Data Ini?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
          // Kirim data menggunakan Fetch API
    fetch(`http://localhost:5000/accounts/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    Swal.fire({
      icon: 'success',
      title: "Data Berhasil Di Ubah",
      showConfirmButton: false,
      timer: 1500
    }).then(function() {
      window.location.reload();
    });
      // console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
});

function showEncrypt(id, n, id_artikel){
  const username_label = [];
  const username_asli = [];
  const username_org = [];
  const password_label = [];
  const password_asli = [];
  const password_org = [];
  for(let b = 1; b <= n ; b++ ){
     username_label[b]=  document.getElementById(`username_label${b}`);
     password_label[b]=  document.getElementById(`password_label${b}`);
    if(id_artikel == b){
      // console.log(id_artikel,b)
      fetch(`http://localhost:5000/accounts/show/${id}`)
      .then(response => response.json())
      .then(data => {
          let datas = data[0].payload;
          password_asli[b] = datas.password_asli;
          username_asli[b] = datas.username_asli;
          password_org[b] = datas.password_dekripsi.toLowerCase();
         username_org[b] = datas.password_username.toLowerCase();
          if (!skor){
            // password_show.innerText = ("Password : " + passwordOrg);
            username_label[b].innerText = ("Username : " + username_org[b]);
            password_label[b].innerText = ("Password : " + password_org[b]);
            skor = true;
          }else{
             username_label[b].innerText = ("Username : " + username_asli[b]);
             password_label[b].innerText = ("Password : " + password_asli[b]);
             skor = false;
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
    }
  }
}

