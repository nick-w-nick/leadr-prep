import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    try {
        return res.status(200).send({
            status: 'success',
            data: 'data'
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            data: error.message
        });
    }
});

export default router;