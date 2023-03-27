const express = require("express");
const { PostModel } = require("../models/Post.model");

const postRouter = express.Router();

postRouter.get("/", async (req, res) => {
    const { user } = req.body;
    const device = req.query.device;
    const { device1, device2 } = req.query;
    if (device1 && device2) {
        try {
            let post = await PostModel.find({
                user,
                $or: [
                    { device: { $regex: `${device1}`, $options: "i" } },
                    { device: { $regex: `${device2}`, $options: "i" } },
                ]
            })
            res.status(200).send(post)
        } catch (error) {
            res.status(401).send({ msg: error.message })
        }
    } else if (device) {
        try {
            let post = await PostModel.find({
                user,
                device: { $regex: `${device}`, $options: "i" },

            })
            res.status(200).send(post)
        } catch (error) {
            res.status(401).send({ msg: error.message })
        }
    } else {
        let post = await PostModel.find({ user })
        res.status(200).send(post)
    }
})

postRouter.post("/add", async (req, res) => {
    const payload = req.body
    try {
        const post = new PostModel(payload);
        await post.save()
        res.send({ msg: "Post Created" })
    } catch (err) {
        console.log(err);
        res.send({ msg: "Something went wrong" })
    }
})

postRouter.patch("/update/:id", async (req, res) => {
    const noteID = req.params.id;
    const payload = req.body;
    try {
        await PostModel.findByIdAndUpdate({ _id: noteID }, payload);
        res.send({ msg: `Note with id:${noteID} has been update` });
    } catch (err) {
        console.log(err);
        res.send({ msg: "Something went wrong" });
    }
});

postRouter.delete("/delete/:id", async (req, res) => {
    const noteID = req.params.id;
    try {
        await PostModel.findByIdAndDelete({ _id: noteID });
        res.send({ msg: `Note with id:${noteID} has been deleted` });
    } catch (err) {
        console.log(err);
        res.send({ msg: "Something went wrong" });
    }
});

module.exports = { postRouter }