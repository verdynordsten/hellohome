import { Router, Response } from 'express';
import { Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { db, JWT_SECRET } from '../../config/database';
import { users } from '../../../src/db/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../../middleware/auth';
import {
  sendSuccessResponse,
  sendBadRequestResponse,
  sendUnauthorizedResponse,
  sendErrorResponse,
  sendNotFoundResponse
} from '../../utils/response';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendBadRequestResponse(res, 'Email and password are required');
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return sendUnauthorizedResponse(res, 'Invalid email or password');
    }

    const user = userResult[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendUnauthorizedResponse(res, 'Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    sendSuccessResponse(res, 'Login successful', {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login failed:', error);
    sendErrorResponse(res, 'Login failed');
  }
});

router.get('/verify', authenticateToken, async (req: Request & { user?: JwtPayload }, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return sendUnauthorizedResponse(res, 'Invalid token payload');
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return sendNotFoundResponse(res, 'User not found');
    }

    const { password: _, ...userWithoutPassword } = userResult[0];
    
    sendSuccessResponse(res, 'Token is valid', {
      user: userWithoutPassword,
      valid: true,
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    sendErrorResponse(res, 'Token verification failed');
  }
});

export default router;