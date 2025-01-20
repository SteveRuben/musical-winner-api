export interface VideoProvider {
    generateToken(roomId: string, accountId: string): string;
}