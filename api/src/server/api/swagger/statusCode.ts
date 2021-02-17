
const RESPONSE_ERROR_CODE : number = 400
const RESPONSE_ERROR_CODE_DESCRIPTION : string = "Error: BAD REQUEST";
const RESPONSE_SUCCESS_CODE : number = 200
const RESPONSE_SUCCESS_CODE_DESCRIPTION : string = "Success";
const SwaggerDefaultResponse = {}

Object.defineProperty(SwaggerDefaultResponse, RESPONSE_SUCCESS_CODE ,{
    value : { description : RESPONSE_SUCCESS_CODE_DESCRIPTION },
    enumerable : true,
})

Object.defineProperty(SwaggerDefaultResponse, RESPONSE_ERROR_CODE ,{
    value : { description : RESPONSE_ERROR_CODE_DESCRIPTION },
    enumerable : true,
})

export default SwaggerDefaultResponse
