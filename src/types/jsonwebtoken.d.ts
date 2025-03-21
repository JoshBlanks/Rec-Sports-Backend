// src/types/jsonwebtoken.d.ts - add custom typings for jsonwebtoken
declare module 'jsonwebtoken' {
    export interface JwtPayload {
      id?: string;
      email?: string;
      role?: string;
      iat?: number;
      exp?: number;
    }
  
    export function sign(
      payload: string | Buffer | object,
      secretOrPrivateKey: string,
      options?: SignOptions
    ): string;
  
    export function verify(
      token: string,
      secretOrPublicKey: string,
      options?: VerifyOptions
    ): JwtPayload | string;
  
    export interface SignOptions {
      algorithm?: string;
      expiresIn?: string | number;
      notBefore?: string | number;
      audience?: string | string[];
      issuer?: string;
      jwtid?: string;
      subject?: string;
      noTimestamp?: boolean;
      header?: object;
      keyid?: string;
      mutatePayload?: boolean;
      encoding?: string;
    }
  
    export interface VerifyOptions {
      algorithms?: string[];
      audience?: string | string[];
      issuer?: string | string[];
      jwtid?: string;
      subject?: string;
      clockTolerance?: number;
      maxAge?: string | number;
      clockTimestamp?: number;
      nonce?: string;
      ignoreExpiration?: boolean;
      ignoreNotBefore?: boolean;
      complete?: boolean;
    }
  }