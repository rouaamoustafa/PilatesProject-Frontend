import jwt from 'jsonwebtoken';

export function verifyToken(token: string) {
  if (!token) return null;
  try {
    // IMPORTANT: Use the SAME secret as your NestJS backend
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
