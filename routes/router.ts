import { Router } from 'express';
import { Card } from '../models/card';

const router = Router();

router.get("/",async (req, res) => {
    try{
        const cards = await Card.find().sort({ createdAt: -1 });
        res.status(200).send(cards);
    } catch (err){
        res.status(500).send('An error occurred while fetching the cards.');
    }
})

router.get("/author/:author",async (req, res) => {
    const author = req.params.author;
    try{
        const cards = await Card.find({author}).sort({ createdAt: -1 });
        res.status(200).send(cards);
    } catch (err){
        res.status(500).send('An error occurred while fetching the cards for specified author.');
    }
})

router.get("/tags/:tag",async (req, res) => {
    const tag = req.params.tag;
    try{
        const cards = await Card.find({tags: tag}).sort({ createdAt: -1 });
        res.status(200).send(cards);
    } catch (err){
        res.status(500).send('An error occurred while fetching the cards for specified.');
    }
})


export default router;