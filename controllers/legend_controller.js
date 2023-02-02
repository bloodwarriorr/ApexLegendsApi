const DB = require("../Database/db");
const LegendRouter = require("express").Router();
const Legend = require("../Models/legend");
const uploadImage=require("../helpers/uploadImage")
const multer = require('multer');
const auth=require("../Middleware/auth")
const fileUpload = multer();

LegendRouter.get("/", auth,async (req, res) => {
    try {
        let legends = await new DB().FindAll("legends");
        res.status(200).json(legends);
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});
LegendRouter.get("/:nickname",auth, async (req, res) => {

    try {
        
        let legend = await new DB().FindByNickName("legends", req.params.nickname.toUpperCase());

        res.status(200).json(legend);
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});
LegendRouter.post("/create",auth,fileUpload.single('image'),uploadImage, async (req, res) => {
    
    try {
        
        let {
            motoSentence,
            nickName,
            description,
            about,
            realName,
            age,
            HomeWorld,
            tacticalAbility,
            passiveAbility,
            ultimateAbility,
        } = req.body;
        if (
            !(motoSentence,
                nickName,
                description,
                about,
                realName,
                age,
                HomeWorld,
                tacticalAbility,
                passiveAbility,
                ultimateAbility
                )
        ) {
            return res.status(400).send("All input is required");
        }

        const oldUser = await new DB().FindByNickName("legends", nickName);
        if (oldUser) {
            return res.status(409).send("Legend Already Exist.");
        }

        let legend = new Legend(motoSentence,
            nickName,
            description,
            about,
            realName,
            age,
            HomeWorld,
            tacticalAbility,
            passiveAbility,
            ultimateAbility, req.imageUrl)
        await new DB().Insert("legends", legend)

        res.status(201).json(legend);
    } catch (error) {
        res.status(500).json({
            error
        });
    }
});
LegendRouter.put("/updateLegend",auth,fileUpload.single('image'),uploadImage, async (req, res) =>{
    try {
        
        let {
            motoSentence,
            nickName,
            description,
            about,
            realName,
            age,
            HomeWorld,
            tacticalAbility,
            passiveAbility,
            ultimateAbility,
        } = req.body;
        if (
            !(motoSentence,
                nickName,
                description,
                about,
                realName,
                age,
                HomeWorld,
                tacticalAbility,
                passiveAbility,
                ultimateAbility
                )
        ) {
            return res.status(400).send("All input is required");
        }

        const oldUser = await new DB().FindByNickName("legends", nickName);
        if (!oldUser) {
            return res.status(409).send("Legend Is Not Exist.");
        }
        oldUser.motoSentence=motoSentence
        oldUser.nickname=nickName
        oldUser.description=description
        oldUser.about=about
        oldUser.realName=realName
        oldUser.age=age
        oldUser.HomeWorld=HomeWorld
        oldUser.tacticalAbility=tacticalAbility
        oldUser.passiveAbility=passiveAbility
        oldUser.ultimateAbility=ultimateAbility

       
        await new DB().UpdateDocById("legends", oldUser._id,oldUser)

        res.status(201).json(oldUser);
    } catch (error) {
        res.status(500).json({
            error
        });
    }
})
LegendRouter.delete("/deleteLegend/:nickname",auth, async (req, res) =>{
    try {
        
        let legend = await new DB().FindByNickName("legends", req.params.nickname.toUpperCase());
        if (legend) {
            await new DB().DeleteDocById("legends", legend._id);
        }
        res.status(200).json("Legend deleted");
    } catch (error) {
        res.status(500).json({
            error
        });
    }
})
module.exports = LegendRouter;