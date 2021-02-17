// interface addPathFunction {
//     name : string,
//     type : string,
//     required : boolean,
//     description : string
// }

// let addPathFunction : addPathFunction[] = [];
// const path1 :addPathFunction = { name : "test", type : "string", required : true, description :"user or admin id"}

export function addPath(addPathFunction: ((path: any, options?: any) => void)) {
    addPathFunction({
        name: "id",
        type: "string",
        required: true,
        description: "user or admin id"
    });

    addPathFunction({
        name: "tokenType",
        type: "string",
        required: true,
        description: "token type"
    });

    addPathFunction({
        name: "token",
        type: "string",
        required: true,
        description: "token"
    });

    addPathFunction({
        name: "transfer",
        type: "string",
        required: true,
        description: "transfer token"
    });

    addPathFunction({
        name: "signup",
        type: "string",
        required: true,
        description: "user/admin sign up "
    });

    addPathFunction({
        name: "signin",
        type: "string",
        required: true,
        description: "user/admin sign in "
    });

    addPathFunction({
        name: "oauth",
        type: "string",
        required: true,
        description: "make jwt"
    });

    addPathFunction({
        name: "bankName",
        type: "string",
        required: true,
        description: "bank name"
    });

    addPathFunction({
        name: "tokenName",
        type: "string",
        required: true,
        description: "token name"
    });

    addPathFunction({
        name: "policy",
        type: "string",
        required: true,
        description: "policy name"
    });

    addPathFunction({
        name: "/",
        type: "string",
        required: true,
        description: "No Path"
    });

    addPathFunction({
        name: "register",
        type: "string",
        required: true,
        description: "Do register"
    });

    addPathFunction({
        name: "reward",
        type: "string",
        required: true,
        description: "reward"
    });

    addPathFunction({
        name: "inflation",
        type: "string",
        required: true,
        description: "inflation"
    });
}
