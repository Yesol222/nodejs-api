import SwaggerDefaultResponse from './statusCode'

export const SwaggerSignUpDescription = {
    common : {
        parameters : {
            body :["User"]
        }
    },
    tags : ["user"],
    responses: SwaggerDefaultResponse
}

export const SwaggerSignInDescription = {
    common : {
        parameters : {
            body : ["LoginRequest"],
        }
    },
    tags : ["user"],
    responses: SwaggerDefaultResponse
}

export const SwaggerOAuthDescription = {
    common : {
        parameters : {
            body : ["OAuthRequest"],
        }
    },
    tags : ["user"],
    responses: SwaggerDefaultResponse
}
