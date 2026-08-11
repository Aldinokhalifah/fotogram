import { type Request, type Response, type NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken'

const auth = (req: Request, res: Response, next: NextFunction) => {
    const cookieToken = req.cookies.token

    if (!cookieToken) return res.status(401).json({ message: 'Token tidak ada' })

    try {
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) throw new Error("JWT_SECRET environment variable is required")

        const decoded = jwt.verify(cookieToken, jwtSecret) as JwtPayload | string

        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && typeof decoded.id === 'string') {
            req.user = { id: decoded.id }
            return next()
        }

        return res.status(401).json({ message: 'Token tidak valid' })
    } catch (error) {
        return res.status(401).json({ message: 'Token tidak valid' })
    }
}

export default auth;