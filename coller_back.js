const CollerModel = require('./models/collerModel')
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

app.post('/coller/:id', async (req, res) => {
    console.log('delete')
    try {
      const object = await CollerModel.findById(req.params.id);
      CollerModel.deleteOne(object)
      .then(() => CollerModel.find())
      .then((docs) => res.send(docs))
    } catch (err) {
      res.status(500).json({ error: 'Failed to find the coller' });
    }
});

app.post("/coller", (req, res) => {

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

        const { collerId, collerName, collerPrice, collerOwner, collerType, collerPower, collerLoud, collerMaterial
        ,oldCloudinaryPublicId, oldImagePath } = fields;
        const { collerImage } = files;

            const collerInfo = {
                collerName, 
                collerPrice, 
                collerOwner, 
                collerType, 
                collerPower, 
                collerLoud, 
                collerMaterial
            };
            
            if (!collerImage.originalFilename) {
                collerInfo.collerImage = oldImagePath;
                collerInfo.cloudinaryPublicId = oldCloudinaryPublicId;
                saveDataToDB(collerId, collerInfo, res);
            }
            else {
                const getImagePath = collerImage.filepath;
                cloudinary.uploader.upload(getImagePath)
                .then(image => {
                    collerInfo.collerImage = image.url;
                    collerInfo.cloudinaryPublicId = image.public_id;
                    saveDataToDB(collerId, collerInfo, res);
                    cloudinary.uploader.destroy(oldCloudinaryPublicId);
                })
                .catch(err => {
                    console.warn(err); 
                })
            }
    });
});

app.get('/coller/:id', async (req, res) => {
    try {
      const object = await CollerModel.findById(req.params.id);
      res.json(object);
    } catch (err) {
      res.status(500).json({ error: 'Failed to find the coller' });
    }
});

app.get('/coller/page/:index', (req, res) => {
    
    CollerModel.find().sort({ createdAt: -1 }).skip(req.params.index*3).limit(3)
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        console.warn('Error in retrieving product list: ', err);
    })
})

app.get('/coller', (req, res) => {
    
    CollerModel.count().then(c => res.json(Math.floor(c / 3)))
})

function saveDataToDB(productId, data, res){
    if (productId == "") {  
        console.log('in save') 
        let coller = new CollerModel({
            name: data.collerName,
            price: data.collerPrice,
            owner: data.collerOwner,
            type: data.collerType,
            power: data.collerPower,
            loud: data.collerLoud,
            material: data.collerMaterial,
            image: data.collerImage
        })
        coller.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log(err)
        })
    }
    else {
        CollerModel.findById(productId)
        .then((coller) => {
            coller.set({
                name: data.collerName,
                price: data.collerPrice,
                owner: data.collerOwner,
                type: data.collerType,
                power: data.collerPower,
                loud: data.collerLoud,
                material: data.collerMaterial,
                image: data.collerImage
            })
            coller.save()
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
}