export type JwtDataFormat = OAuthJwt | UserJwt;

export interface Jwt {
    jwt: string
}

export interface OAuthJwt {
    orcid: string
    name: string
    iat?: number
}

export interface UserJwt {
    orcid: string
    name: string
    bank_name: string
    iat?: number
}