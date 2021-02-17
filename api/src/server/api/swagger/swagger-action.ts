import SwaggerDefaultResponse from './statusCode'


export const SwaggerRewardActionDescription = {
    common : {
        parameters : {
            body : ["Reward"],
            header : ["Authorization"]
        }
    },
    tags : ["action"],
    responses : SwaggerDefaultResponse
}

export const SwaggerActionPolicyCreateDescription = {
    common : {
        parameters : {
            body : ["ActionPolicy"]
        }
    },
    tags : ["action"],
    responses : SwaggerDefaultResponse
}

export const SwaggerActionPolicyUpdateDescription = {
    common : {
        parameters : {
            body : ["ActionPolicy"]
        }
    },
    tags : ["action"],
    responses : SwaggerDefaultResponse
}


export const SwaggerActionDeleteTokenDescription = {
    tags : ["action"],
    responses : SwaggerDefaultResponse
}

export const SwaggerGetActionDescription = {
    common : {
        parameters : {
            header : ["Authorization"]
        }
    },
    tags : ["action"],
    responses : SwaggerDefaultResponse
}