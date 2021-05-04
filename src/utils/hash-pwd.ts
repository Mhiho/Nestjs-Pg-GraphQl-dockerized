import * as crypto from 'crypto';

const salt = crypto.randomBytes(60);

export const hashPwd = (p: string): string => {
    const hmac = crypto.createHmac('sha512', salt)
    hmac.update(p);
    return hmac.digest('hex');
}