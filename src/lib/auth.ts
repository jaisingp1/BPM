import { hashPassword, verifyPassword } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  roles: string[];
}

export async function hashPasswordFunc(password: string): Promise<string> {
  return hashPassword(password, 12);
}

export async function verifyPasswordFunc(password: string, hashedPassword: string): Promise<boolean> {
  return verifyPassword(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      roles: user.roles 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.roles || []
    };
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user || !user.password) {
      return null;
    }

    const isValidPassword = await verifyPasswordFunc(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.userRoles.map(ur => ur.role.name)
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function createUser(email: string, password: string, name?: string): Promise<AuthUser> {
  try {
    const hashedPassword = await hashPasswordFunc(password);
    
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.userRoles.map(ur => ur.role.name)
    };
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
}