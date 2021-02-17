import SwaggerDefaultResponse from './statusCode'

export const SwaggerGetTransaction = {
    common : {
        parameters : {
            header : ["Authorization"]
        }
    },
    tags : ["transaction"],
    responses : SwaggerDefaultResponse
}