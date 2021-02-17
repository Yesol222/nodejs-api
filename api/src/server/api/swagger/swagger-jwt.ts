import SwaggerDefaultResponse from './statusCode'

export const SwaggerJwtCheckDescription = {
    common : {
        parameters : {
            header : ["Authorization"]
        }
    },
    tags : ["jwt"],
    responses : SwaggerDefaultResponse
}

export const SwaggerCheckJwtDescription = {
    common : {
        parameters : {
            header : ["Authorization"]
        }
    },
    tags : ["jwt"],
    responses : SwaggerDefaultResponse
}
