const response = (statusCode, data, message, res) => {
    res.json(statusCode,[
        {
          payload :  data,
          message : message, 
          metadata : {
              prev : "",
              next : "",
              curent: ""
         },
   }
])
}

module.exports = response