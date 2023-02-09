import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(object: Object, keyname: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: jwt.SignOptions | undefined) {
    const signingkey = Buffer.from(config.get<string>(keyname), 'base64').toString('ascii')
    return jwt.sign(object, signingkey, {
        ...(options && options),
        algorithm: 'RS256',
    })
}

export function verifyJwt<T>(token: string, keyname: "accessTokenPublicKey" | "refreshTokenPublicKey"): T | null {
    const verifyingkey = Buffer.from(config.get<string>(keyname), 'base64').toString('ascii')
    try {
        const decoded = jwt.verify(token, verifyingkey) as T;
        return decoded;
    }
    catch (err: any) {
        return null;
    }
}