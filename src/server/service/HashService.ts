import bcrypt from 'bcrypt';

export default class HashService {
    private static rounds = 10;

    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, HashService.rounds);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}