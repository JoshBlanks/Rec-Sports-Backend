import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Team from '../models/team.model';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Interface for decoded JWT token
 */
interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Use type assertion to bypass TypeScript error
const verifyToken = (token: string): any => {
  return (jwt as any).verify(token, JWT_SECRET);
};

/**
 * Middleware to protect routes - verifies JWT token
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify token using our helper function
    const decoded = verifyToken(token) as DecodedToken;

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

/**
 * Middleware to restrict access based on user role
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user should be set by protect middleware
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ 
        message: `User role ${user.role} is not authorized to access this route` 
      });
    }
    
    next();
  };
};

/**
 * Check if user is a team captain
 */
export const isTeamCaptain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { teamId } = req.params;
    
    // Check if user is captain of the team
    const team = await Team.findOne({ _id: teamId, captainId: userId });
    
    if (!team) {
      return res.status(403).json({ message: 'You are not authorized to manage this team' });
    }
    
    next();
  } catch (error) {
    console.error('Team captain check error:', error);
    res.status(500).json({ message: 'Server error checking team permissions' });
  }
};