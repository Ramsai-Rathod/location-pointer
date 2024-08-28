const express=require('express')
const socket=require("socket.io")
const http=require('http')
const path =require("path")
const app=express()

const server=http.createServer(app)
const io=socket(server)
app.get('/',(req,res)=>{
res.render('index')
})
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,"public")))

io.on('connection',(socket)=>{
    io.emit("disconnected",{id:socket.id})
    socket.on("send-location",function(data){
        io.emit("location-info",{id:socket.id,...data})
    })
})



server.listen(3000,()=>console.log("server listing on port number 3000"))
