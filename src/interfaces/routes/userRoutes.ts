import { Router } from "express";

const router = Router();

router.get('/user', (req, res) => {
    console.log('hello I am user')
});

router.post('/user', (req, res) => {
    console.log(req.body)
});

export default router;