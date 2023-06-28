const UserModel = require('./models/userModel')
const formidable = require("formidable");

app.post('/user', (req, res) => {
    const form = formidable({
        multiples: true,                    
        keepExtensions: true,              
    });

    form.parse(req, async (err, fields, files) => {
        
        if (err) {
          console.log("Error parsing the files");
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
        }

        const { userName, userLogin, userPassword } = fields;
            
        let user = new UserModel({
            name: userName,
            login: userLogin,
            password: userPassword,
            isAdmin: false
        })
        user.save()
        .then(() => {
            console.log('user is added')
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(err)
        })
    })
})

app.get('/user/:login', async (req, res) => {
    try{
        const object = await UserModel.find({ login: req.params.login})
        res.json(object)
    }catch(err){
        res.status(500).json({ error: 'Failed to find the user' });
    }
})

app.get('/user/:login/:password', async (req, res) => {
    try {
      const object = await UserModel.find({ login: req.params.login, password: req.params.password });
      res.json(object);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to find the user' });
    }
  });