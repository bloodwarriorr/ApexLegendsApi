//load env vars
require('dotenv').config();
//libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session=require('express-session')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument=require('./swagger.json')
const path = require('path')
const options = {
    customCss: '.swagger-ui .topbar { color:red }',
    customSiteTitle: "Apex-Legends-API",

  };
//port
const PORT = process.env.PORT || 5008;
//create server
const server = express();
server.use(session({secret:process.env.SESSION_SECRET}))
server.use(passport.initialize())
server.use(passport.session())
server.use(express.json()); //enable json support
server.use(cors({
    origin: 'https://apex-legends-api.vercel.app'
})); //enable global access
server.use(helmet()); //more defense
server.use('/api/legends',require("./controllers/legend_controller"))
server.use('/',require("./controllers/user_controller"))
server.use('/api/docs',express.static(path.join(process.cwd(),"swagger-css")))

server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));

server.get('/logout',(req,res)=>{
    req.logOut()
    req.session.destroy()
    res.send('GoodBye!')
})

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));