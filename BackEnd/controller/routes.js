const express = require('express')
const router = express.Router();
const dataBase = require ('../model/connection')
const response = require ('./response')
const jwt = require('jsonwebtoken');
const { vigenereDecrypt, vigenereEncrypt, generateKey  } = require ('../model/encryption');
// const bcrypt = require('bcryptjs');


// routes/endpoint start
router.get('/', (req, res) => {
    response(200, "Api Connect", "Success", res)
})

router.get('/accounts', (req, res) => {
    const sql = "Select * from manager_passwords"
    dataBase.query(sql, (err, result) => {
        if (err) throw err
        // hasil data dr mysql
        response(200, result, "Data berhasil didapatkan", res)
    })
})

// get id for display to home
router.get('/accounts/:id', (req, res) => {
  const id = req.params.id
  const sql = `Select * from manager_passwords where user_id = ${id}`
  // console.log(sql)
  dataBase.query(sql, (err, result) => {
      if (err) throw err
      // hasil data dr mysql
      response(200, result, "Data spesifik user by id berhasil didapatkan", res)
  })
})

router.get('/accounts/show/:id', (req, res) => {
  const id = req.params.id
  const sql = `Select * from manager_passwords where id = ${id}`
  // console.log(sql)
  dataBase.query(sql, (err, result) => {
      if (err) throw err
      // hasil dta dr mysql
      let datas = result[0];
      // console.log(datas.service_password);
      const decryptUsername = vigenereDecrypt(datas.service_username,datas.key2);
      const decryptPassword = vigenereDecrypt(datas.service_password,datas.key1);
      const dataPayload = {
             username_asli : datas.service_username,
             password_asli : datas.service_password,
             password_username : decryptUsername,
             password_dekripsi : decryptPassword
      }
      response(200, dataPayload, "Data spesifik user by id berhasil didapatkan", res)
  })
})

router.get('/accounts/updates/:id', (req, res) => {
    const id = req.params.id
    const sql = `Select * from manager_passwords where id = ${id}`
    dataBase.query(sql, (err, result) => {
        if (err) throw err
        let datas = result[0];
        // console.log(datas.service_password);
        const decryptUsername = vigenereDecrypt(datas.service_username,datas.key2);
        const decryptPassword = vigenereDecrypt(datas.service_password,datas.key1);
        const dataPayload = {
               id : datas.id,
               service_name : datas.service_name,
               chipertext_username : datas.service_username,
               chipertext_password : datas.service_password,
               category : datas.category,
               username_dekripsi : decryptUsername,
               password_dekripsi : decryptPassword
        }
        // hasil data dr mysql
        response(200, dataPayload, "Data spesifik by id berhasil didapatkan", res)
    })
})

// post data account_manager_password
router.post('/accounts', (req, res) => {
    const { id, service_name, username, password, category } = req.body
    const key = generateKey();
    const service_usernameEncrypt = vigenereEncrypt(username, key);
    const service_passwordEncrypt = vigenereEncrypt(password, key);

    const sql = `INSERT INTO manager_passwords (service_name, service_username, service_password, user_id, category, key1, key2) VALUES 
                 ('${service_name}', '${service_usernameEncrypt.ciphertext}', '${service_passwordEncrypt.ciphertext}', ${id},  '${category}', '${service_passwordEncrypt.key}', '${service_usernameEncrypt.key}' )`
// console.log(sql);
    dataBase.query(sql, (err, result) => {
        if (err) response(404, "Data Gagal Ditambahkan", "fail", res)
        if (result?.affectedRows) {
            // console.log(result)
            const data = {
                isSuccess : result.affectedRows,
                id        : result.insertId,
            }
            response(200, data, "data berhasil ditambahkan", res)
            
        }
    })
})

// post data user/register
router.post('/accounts/register', (req, res) => {
    const { username, email, password, cpassword } = req.body;

    const key = generateKey();
    const resultEncrypt = vigenereEncrypt(password, key);
    const resultEncryptCp = vigenereEncrypt(cpassword, key);
    const decryptPassword = vigenereDecrypt(resultEncrypt.ciphertext,resultEncrypt.key);

  
    // Validasi password
    if (resultEncrypt.ciphertext !== resultEncryptCp.ciphertext) {
      return res.status(400).json({ message: 'Passwords Tidak Sama' });
    }
  
    // Insert data ke database
    const sql = `INSERT INTO users (username, password, email, encryption_key) VALUES ('${username}' ,'${resultEncrypt.ciphertext}','${email}','${resultEncrypt.key}')`;
    // console.log(sql);
    dataBase.query(sql, (err, result) => {
        if (err) response(404, "Data Register Gagal Ditambahkan, Username atau Email sudah ada", "fail", res)
        if (result?.affectedRows) {
            const data = { 
                isSuccess : result.affectedRows,
                id        : result.insertId,
                data      : {
                  "password_asli" : password,
                  "password_enkripsi" : resultEncrypt.ciphertext,
                  "password_dekripsi" : decryptPassword.toLowerCase()
                }
            }
            return res.status(200).json({
              message: "User registered successfully",
              status: "success",
              data
          });
        }
    });
  });

router.put('/accounts/:id', (req, res) => {
    const id = req.params.id
    const { service_name, username, password, category } = req.body
    let hashUsername = "";
    let hashPassword = "";
    const sql2 = `Select * from manager_passwords where id = ${id}`
    dataBase.query(sql2, (err, result) => {
      let datas = result[0];
      const decryptUsername = vigenereEncrypt(username,datas.key2);
      const decryptPassword = vigenereEncrypt(password,datas.key1);
   
    const sql = `UPDATE manager_passwords SET service_name = '${service_name}', service_username = '${decryptUsername.ciphertext}',
                 service_password = '${decryptPassword.ciphertext}', category = '${category}', key1 = '${decryptPassword.key}', key2 = '${decryptUsername.key}' WHERE manager_passwords.id = ${id}`
    
    dataBase.query(sql, (err, result) => {
     if (err) response(404, "Gagal memperbarui Data. Id tidak ditemukan", "fail", res)
     if(result?.affectedRows) {
         const data = {
                isSuccess : result.affectedRows,
                message   : result.message
            }
         response(200, data, "update data successfuly", res)
      }else{
        response(404, "Gagal memperbarui Data. Id tidak ditemukan", "fail", res)
      }
    })
   })
}) 

  router.delete('/accounts/:id', (req, res) =>{
     const id = req.params.id
    const sql = ` DELETE FROM manager_passwords WHERE manager_passwords.id = ${id} `

    dataBase.query(sql, (err, result) => {
        if (err) response(404, console.log(id), res)
        if(result?.affectedRows) {
            const data = {
                isDeleted : result.affectedRows,
            }
            response(200, data, "Data Berhasil Dihapus", res)
         }
         else{
           response(404, "Gagal menghapus Data. Id tidak ditemukan", "fail", res)
         }
    })
  })


// Secret key untuk JWT
const JWT_SECRET = 'hardiman'

// Route untuk login
router.post('/accounts/login', (req, res) => {
  const { username, password } = req.body;
 
  // Cek apakah email ada di database
  const sql = `SELECT * FROM users WHERE username ="${username}"`;
  console.log(sql);
  dataBase.query(sql, (err, results) => {
    if (err) response(404, "Login Gagal", "fail", res)

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    const userDecrypt = user.password;
    const decryptPassword = vigenereDecrypt(userDecrypt, user.encryption_key);

    if (password.toLowerCase() !== decryptPassword.toLowerCase() || username !== user.username) {
    console.log(password.toLowerCase() +" = "+ decryptPassword.toLowerCase());
      return res.status(401).json({ message: 'Password atau Username Salah' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '10s'
    });

    // Kirim token sebagai respons
    res.status(200).json({ message: 'Login successful', token: token,
    id: user.id });
  });
});
// routes/endpoit end
module.exports = router;