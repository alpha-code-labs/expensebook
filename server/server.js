const express=require("express")
const mongoose=require("mongoose")
const app=express()
const Product=require('./models/productModel')

app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.get('/',(req,res)=>{
    res.send('Hello Node API')
})
app.get('/blog',(req,res)=>{
    res.send('Hello blog')
})

app.get('/product', async(req,res)=>{
    try {
        const products=await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

app.get('/product/:id', async(req,res)=>{
    try {
        const {id}=req.params
        const products=await Product.findById(id)
        res.status(200).json(products)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

app.post('/product',async(req,res)=>{
    try {
        const product=await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
    
})

app.put('/product/:id', async(req,res)=>{
    try {
        const {id}=req.params
        const product=await Product.findByIdAndUpdate(id, req.body);
        if(!product)
        {
            return res.status(404).json({message:`element not found`})
        }
        const updatedProduct=await Product.findById(id)
        res.status(200).json(updatedProduct)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

app.delete("/product/:id", async(req, res)=>{
    try {
        const {id}=req.params
        const product=await Product.findByIdAndDelete(id)
        if(!product)
        {
            return res.status(404).json({message: `element not found`})
        }
        res.status(200).json(product)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

mongoose.connect("mongodb+srv://acladmin:QlSYiddbBy7J9yS6@mycluster.58esz73.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("Connected to mongodb")
    app.listen (3000,()=>{
        console.log(`Node API app is running on port 3000`)
    })
}).catch((error)=>{
    console.log(error)
})
