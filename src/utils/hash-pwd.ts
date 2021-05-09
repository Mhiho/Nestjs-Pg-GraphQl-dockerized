import * as bcrypt from 'bcrypt';


export const hash = async (p: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(p, salt);
    return hashed;
}