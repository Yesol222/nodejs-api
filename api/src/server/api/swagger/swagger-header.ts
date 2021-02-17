export function addHeader(addHeaderFunction: ((header: any, options?: any) => void)) {

    addHeaderFunction({
        name : "Authorization",
        description : "cheack jwt",
        required: true,
        type : "string"
    });



}