import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cryptoRandomString from 'crypto-random-string';
import {
  decode,
  DecodeOptions,
  sign,
  SignOptions,
  verify,
  VerifyOptions,
} from 'jsonwebtoken';
import { v4 } from 'uuid';

import { INVALID_TOKEN } from '../../errors/errors.constants';


@Injectable()
export class TokensService {
  private logger = new Logger(TokensService.name);
  constructor(private configService: ConfigService) {}

  /**
   * Sign a JWT
   * @param subject - Subject
   * @param payload - Object payload
   * @param expiresIn - Expiry string (vercel/ms)
   * @param options - Signing options
   */
  signJwt(
    subject: string,
    payload: number | string | object | Buffer, // eslint-disable-line
    expiresIn?: string,
    options?: SignOptions,
  ) {
    if (typeof payload === 'number') payload = payload.toString();
    return sign(
      payload,
      this.configService.get<string>('security.jwtSecret') ?? '',
      {
        ...options,
        subject,
        expiresIn,
      },
    );
  }

  /**
   * Verify and decode a JWT
   * @param subject - Subject
   * @param token - JWT
   * @param options - Verify options
   */
  verify<T>(subject: string, token: string, options?: VerifyOptions) {
    try {
      return verify(
        token,
        this.configService.get<string>('security.jwtSecret') ?? '',
        { ...options, subject },
      ) as any as T;
    } catch (error) {
      throw new UnauthorizedException(INVALID_TOKEN);
    }
  }

  /**
   * Decode a JWT without verifying it
   * @deprecated Use verify() instead
   * @param token - JWT
   * @param options - Decode options
   */
  decode<T>(token: string, options?: DecodeOptions) {
    return decode(token, options) as T;
  }

  /**
   * Generate a UUID
   */
  generateUuid() {
    return v4();
  }

  /**
   * Generate a cryptographically strong random string
   * @param length - Length of returned string
   * @param charactersOrType - Characters or one of the supported types
   */
  async generateRandomString(
    length = 32,
    charactersOrType= 'alphanumeric',
  ): Promise<string> {
    this.logger.warn(length, charactersOrType);
    return cryptoRandomString({ length, characters: charactersOrType });
  }

  /**
   * Generate a cryptographically strong random string
   * @param length - Length of returned string
   * @param charactersOrType - Characters or one of the supported types
   */
  async generateRandomInt(
    length = 32,
    characters= '0123456789',
  ): Promise<string> {
    this.logger.warn(length, characters);
    return cryptoRandomString({ length, characters: characters });
  }
}
//cryptoRandomString({length: 10, characters: '0123456789'});