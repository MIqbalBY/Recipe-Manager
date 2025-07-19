import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    // Check if user already exists
    const existingUser = await db
      .selectFrom('users')
      .select('id')
      .where('email', '=', email)
      .executeTakeFirst();
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await db
      .insertInto('users')
      .values({
        email,
        password_hash: passwordHash,
        name
      })
      .executeTakeFirst();
    
    const user = await db
      .selectFrom('users')
      .select(['id', 'email', 'name', 'avatar_url'])
      .where('id', '=', Number(result.insertId))
      .executeTakeFirst();
    
    // Generate token
    const token = jwt.sign({ userId: user!.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await db
      .selectFrom('users')
      .select(['id', 'email', 'name', 'password_hash', 'avatar_url'])
      .where('email', '=', email)
      .executeTakeFirst();
    
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        avatar_url: user.avatar_url 
      }, 
      token 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Google OAuth (simplified - you would need Google OAuth SDK)
router.post('/google', async (req, res) => {
  try {
    const { googleToken, email, name, avatar_url, google_id } = req.body;
    
    if (!email || !name || !google_id) {
      return res.status(400).json({ error: 'Google user information is required' });
    }
    
    // Check if user exists
    let user = await db
      .selectFrom('users')
      .select(['id', 'email', 'name', 'avatar_url'])
      .where('google_id', '=', google_id)
      .executeTakeFirst();
    
    if (!user) {
      // Check if user exists with same email
      const existingUser = await db
        .selectFrom('users')
        .select('id')
        .where('email', '=', email)
        .executeTakeFirst();
      
      if (existingUser) {
        // Link Google account to existing user
        await db
          .updateTable('users')
          .set({
            google_id,
            avatar_url,
            updated_at: new Date().toISOString()
          })
          .where('id', '=', existingUser.id)
          .execute();
        
        user = await db
          .selectFrom('users')
          .select(['id', 'email', 'name', 'avatar_url'])
          .where('id', '=', existingUser.id)
          .executeTakeFirst();
      } else {
        // Create new user
        const result = await db
          .insertInto('users')
          .values({
            email,
            name,
            google_id,
            avatar_url
          })
          .executeTakeFirst();
        
        user = await db
          .selectFrom('users')
          .select(['id', 'email', 'name', 'avatar_url'])
          .where('id', '=', Number(result.insertId))
          .executeTakeFirst();
      }
    }
    
    // Generate token
    const token = jwt.sign({ userId: user!.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ user, token });
  } catch (error) {
    console.error('Error with Google auth:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await db
      .selectFrom('users')
      .select(['id', 'email', 'name', 'avatar_url'])
      .where('id', '=', decoded.userId)
      .executeTakeFirst();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;