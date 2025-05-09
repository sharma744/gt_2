let db=require("../model/model1")
let db2=require("../model/model2")
let controller=require("../controller")
let fs=require("fs")
let streamifier=require("streamifier")
let multer=require("multer")
let cloudinary=require("cloudinary").v2
 cloudinary.config({ 
    cloud_name: 'dayvf7ugs', 
    api_key: '682215271415542', 
    api_secret: 'U6m71klfo3p3UfG3iGEIRW-6Hxo' // Click 'View API Keys' above to copy your API secret
});
let path=require("path")
let func=(app)=>{
    app.post("/postdata",async(req,res)=>{
        let header=await req.body;
       try{
        let data={
            roomno:header.roomno,
            name:header.name
        }
        await db.insertOne(data);
        console.log(data);
         res.send(typeof(1));
    }catch(error){
         res.send(error);
        
    }  
    finally{
        res.send(1);
    }      

    })
    app.post("/getdata",async(req,res)=>{
        let body=await req.body;
        let a=await db.findOne({$and:[{roomno:body.roomno},{name:body.name}]});
       if(a){
        res.send(1)
       }
       else{
        res.send(0);
       }
    }
    )
    app.post("/updateroom",async(req,res)=>{
        let body=await req.body;
        let rm=await db2.findOne({roomno:body.roomno})
        let rm1=await db2.findOne({"student1.rollno":body.rollno})
        let rm2=await db2.findOne({"student2.rollno":body.rollno})
        let rm3=await db2.findOne({"student3.rollno":body.rollno})
        if(rm1==null && rm2==null && rm3==null){
        console.log(rm);
        if(rm.student1.rollno==body.rollno || rm.student2.rollno==body.rollno || rm.student3.rollno==body.rollno){
            res.send("student room already assigned")
        }
        if(rm.full==true){
            res.send("room is full");
        }
        if(rm.student1.rollno==0){
            update={"student1.name":body.name,"student1.rollno":body.rollno,"student1.filepath":body.path,count:1}
          await db2.updateOne({roomno:body.roomno},{$set:update})
          res.send("updated succesfully");
        }
        else if(rm.student2.rollno==0){
            update={"student2.name":body.name,"student2.rollno":body.rollno,"student1.filepath":body.path,count:2}
            await db2.updateOne({roomno:body.roomno},{$set:update})
            res.send("updated succesfully");
        }
       else if(rm.student3.rollno==0){
            update={"student3.name":body.name,"student3.rollno":body.rollno,"student1.filepath":body.path,count:3,full:true}
            await db2.updateOne({roomno:body.roomno},{$set:update})
            res.send("updated succesfully");

        }
        else{
            res.send("sorry room already full");
        }
    }
    else{
        res.send("room already alloted in another room");
    }
      

        

    })
    app.get("/unoccupiedroom",async(req,res)=>{
        let db=await db2.find({full:false});
        console.log(await db.roomno);
        res.send(db);


    })
    app.get("/bookroom",async(req,res)=>{
        let body=await req.body;
        let data={
            student1:body.student,
            student2:null,
            student3:null,
            roomno:body.roomno,
            count:1,
            flag:false
        }
        await db2.insertOne(data);
        res.send("room booked succesfully");


         
    })
      const upload = multer({ storage:multer.memoryStorage()});
      
    app.post("/fetchdata",upload.single("file"),async(req,res,next)=>{
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };
    
        try {
            const result = await streamUpload(req.file.buffer);
            // controller.fetch(await result.url)
            console.log(result)
            res.send({ message: "Uploaded!", url: result.secure_url });
        } catch (err) {
            res.status(500).send("Upload failed");
        }
               res.send((req.data));
    }
    )}

    
module.exports=func;
