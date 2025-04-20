let mongoose=require("mongoose")
let express=require("express")
let db2=require("./model/model2.js")
let fun=async()=>{
// const url=mongodb+srv://nodeuser:<db_password>@cluster0.ag3fwai.mongodb.net/
mongoose.connect("mongodb+srv://nodeuser:Yahoo123@cluster0.ag3fwai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
let db=mongoose.connection;
db.once('open',()=>{
console.log("database connected");
})
db.on('error',()=>{
    console.log("data base coneection error");
})
}
fun();
let fn=async()=>{
    for(let i=0;i<203;i++){
       let room={
        roomno:i+1
       }
       db2.insertOne(room);

}
}
fn();
let app=express();
app.use(express.json())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
require("./routes/route1.js")(app);
app.listen(3000,()=>{
    console.log("server connected succesfully");
})