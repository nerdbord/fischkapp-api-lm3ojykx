import { Router } from 'express';
import { Card } from '../models/card';

const router = Router();

router.get("/",async (req, res) => {
    try{
        const cards = await Card.find();
        res.status(200).send(cards);
    } catch (err){
        res.status(500).json({message: err})
    }
})

router.get("/author/:author",async (req, res) => {
    const author = req.params.author;
    try{
        const cards = await Card.find({author});
        res.status(200).send(cards);
    } catch (err){
        res.status(500).json({message: err})
    }
})

router.get("/tags/:tag",async (req, res) => {
    const tag = req.params.tag;
    try{
        const cards = await Card.find({tags: tag});
        res.status(200).send(cards);
    } catch (err){
        res.status(500).json({message: err})
    }
})


export default router;