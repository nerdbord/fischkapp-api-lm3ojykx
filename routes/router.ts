import { Router } from 'express';
import { Card } from '../models/card';
import { UpdateCardPayload } from '../types/cardTypes';

const cardRoutes = Router();

cardRoutes.get("/",async (req, res) => {
    try{
        const cards = await Card.find().sort({ createdAt: -1 });
        res.status(200).send(cards);
    } catch (err){
        res.status(500).send('An error occurred while fetching the cards.');
    }
})

cardRoutes.get("/author/:author",async (req, res) => {
    const author = req.params.author;
    try{
        const cards = await Card.find({author}).sort({ createdAt: -1 });
        res.status(200).send(cards);
    } catch (err){
        res.status(500).send('An error occurred while fetching the cards for specified author.');
    }
})

cardRoutes.get("/tags/:tag",async (req, res) => {
    const tag = req.params.tag;
    try{
        const cards = await Card.find({tags: tag}).sort({ createdAt: -1 });
        res.status(200).send(cards);
    } catch (err){
        res.status(500).send('An error occurred while fetching the cards for specified.');
    }
})

cardRoutes.put("/:id", async (req,res) => {
    const id = req.params.id;
    const {front, back, tags} = req.body as UpdateCardPayload;

    try{

        if(!front){return res.status(404).send('front not found.');};
        const card = await Card.findById(id);
        
        if (!card) {
            return res.status(404).send('Card not found.');
        }

        card.front = front;
        card.back = back;
        card.tags = tags;

        await card.save();
        res.send(card);

    } catch (err){
        res.status(500).send("An error ocurred while editing card");
    }
})

export default cardRoutes;