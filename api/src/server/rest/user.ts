export interface LoginRequest {
    orcid: string;
    password: string
}

export interface User {
	orcid: string
	name: string
	email: string
	bank_name: string
	password: string
	authority: boolean
}

export interface OAuthRequest {
    code: string
}
