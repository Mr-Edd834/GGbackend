const express=require('express');
const cors=require('cors');

require("dotenv").config();
 const port=process.env.PORT;   

 const hostname=process.env.HOSTNAME;

    const app=express();
    app.use(cors());
    app.use(express.json());

