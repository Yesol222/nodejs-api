import SwaggerDefaultResponse from './statusCode'
export const SwaggerGetTokenDescription = {
    common : {
        parameters : {
            header : ["Authorization"]
        }
    },
    tags : ["token"],
        responses : SwaggerDefaultResponse
    }

export const SwaggerTokenGenerateDescription = {
    common: {
        parameters : {
            body : ["Token"],
            header : ["Authorization"]
        }
    },
    tags : ["token"],
    responses : SwaggerDefaultResponse
}

export const SwaggerTokenTransferDescription = {
    common: {
        parameters : {
            body: ["Transfer"],
            header : ["Authorization"]
        }
    },
    tags : ["token"],
    responses : SwaggerDefaultResponse
}

export const SwaggerInflateDescription = {
    common : {
        parameters : {
            header : ["Authorization"]
        }
    },
    tags : ["token"],
    responses : SwaggerDefaultResponse
}