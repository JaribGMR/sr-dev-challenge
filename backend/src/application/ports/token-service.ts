import { UserRole } from '../../domain/entities/user';

export const TOKEN_SERVICE = 'TokenService';

// What is saved inside the token, to know who makes each request.
export interface TokenPayload {
  userId: string;
  role: UserRole;
  distributorId: string | null;
}

export interface TokenService {
  // Creates the token the user sends in every request after logging in.
  sign(payload: TokenPayload): Promise<string>;
}
