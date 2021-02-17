export function addModel(addModelFunction: ((model: any, options?: any) => void)) {
    const TOKEN_PROPERTIES = {
        token: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        example: "ST"
                    },
                    initialization_balance: {
                        type: "number",
                        example: 10000
                    },
                    global_balance: {
                        type: "number",
                        example: 10000
                    },
                    bank_balance: {
                        type: "number",
                        example: 9000
                    },
                    inflation_policy: {
                        type: "object",
                        properties: {
                            inflation_type: {
                                type: "string",
                                example: "percent"
                            },
                            base_line_type: {
                                type: "string",
                                example: "initializationBalance"
                            },
                            period: {
                                type: "string",
                                example: "*/1 * * * *"
                            },
                            inflation_value: {
                                type: "number",
                                example: 10
                            },
                            latest_inflation_value: {
                                type: "number",
                                example: 1000
                            }
                        }
                    }
                }
            }
        },
    }
    addModelFunction({
        name: "User",
        type: "object",
        properties: {
            orcid: {
                type: "string",
                example: "0000-0002-8051-2166"
            },
            name : {
                type: "string",
                example : "yesolkim"
            },
            email : {
                type: "string",
                example : "yesolkim@smartm2m.co.kr"
            },
            bank_name : {
                type : "string",
                example : "hana"
            },
            password: {
                type: "string",
                example: "p@ssw0rd"
            },
            level : {
                type : "string",
                example : "3"
            }
        }
    });
    addModelFunction({
        name: "Bank",
        type: "object",
        properties: {
            name: {
                type: "string",
                example: "kisti"
            },
            ...TOKEN_PROPERTIES,
            action_policy: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            example: "commit"
                        },
                        reward: {
                            type: "number",
                            example: 100
                        },
                        token_type: {
                            type: "string",
                            example: "ST"
                        },
                        bank_name: {
                            type: "string",
                            example: "kisti"
                        }
                    }
                }
            }
        }
    });

    addModelFunction({
        name: "Token",
        type: "object",
        properties: TOKEN_PROPERTIES
    });

    addModelFunction({
        name: "ActionPolicy",
        type: "object",
        properties: {
            type: {
                type: "string",
                example: "commit"
            },
            reward: {
                type: "number",
                example: 100
            },
            token_type: {
                type: "string",
                example: "ST"
            },
            bank_name: {
                type: "string",
                example: "kisti"
            }
        }
    });

    addModelFunction({
        name: "LoginRequest",
        type: "object",
        properties: {
            orcid: {
                type : "string",
                example : "id123"
            },
            password: {
                type : "string",
                example : "pas123"
            }
        }
    });

    addModelFunction({
        name: "OAuthRequest",
        type: "object",
        properties: {
            code :{
                type: "string",
                example: "CD23D"
            }
        }
    });

    addModelFunction({
        name: "Jwt",
        type: "object",
        properties: {
            jwt: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmNpZCI6IjAwMDAtMDAwMi04MDUxLTIxNjMyMjYiLCJlbWFpbCI6InNvbEBzbWFydG0ybS5jby5rciIsIm5hbWUiOiJTb2wgS2FuZyIsImlhdCI6MTU3Mjc0MDcxNn0.JUGAWwFqvISm3eiVwk2XGUyfyte3IQmx93gHzaYcOr0"
            },
        }
    });


    addModelFunction({
        name: "TokenTransfer",
        type: "object",
        properties: {
            bank_name : {
                type : "string",
                example : "kisti"
            },
            token_name : {
                type : "string",
                example : "token_name"
            },
            from : {
                type :"string",
                example : "user1"
            },
            to : {
                type : "string",
                example : "user2"
            },
            value : {
                type : "number",
                example : 123
            }
        }
    });

    addModelFunction({
        name: "Reward",
        type: "object",
        properties: {
            bank_name : {
                type : "string",
                example : "kisti"
            },
            action_type : {
                type : "string",
                example : "transfer"
            },
            user : {
                type : "string",
                example : "user1"
            }
        }
    });

    addModelFunction({
        name: "Transaction",
        type: "object",
        properties: {
            bank_name: {
                type: "string",
                example: "kisti"
            }
        }
    });
}





