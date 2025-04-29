import { Router, Response } from 'express';
import verifyToken, { AuthenticatedRequest } from '../middleware/verifyToken';
import jwt from 'jsonwebtoken';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  return res.json({ token });
});

// GET /api/auth/protected
const protectedRouteHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { user } = req;
        res.json({ message: `Hello ${user!.username}, you are authenticated!` });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

router.get("/protected", verifyToken, protectedRouteHandler);

export default router;
