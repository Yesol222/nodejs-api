export function addBody(addBodyFunction: ((body: any, options?: any) => void)) {
    const TOKEN_KEY_PROPERTIES = {
        bank_name: {
            type: "string",
            example: "kisti"
        },
        token_type: {
            type: "string",
            example: "ST"
        }
    };
    const INFLATION_POLICY_PROPERTIES = {
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
                }
            }
        }
    };
    addBodyFunction({
        name: "enrollAdmin",
        required: true,
        schema: {
            type: "object",
            properties: {
                admin_id: {
                    type: "string",
                    example: "admin"
                },
                admin_password: {
                    type: "string",
                    example: "adminpw"
                },
            },
        }
    });
    addBodyFunction({
        name: "enrollUser",
        required: true,
        schema: {
            type: "object",
            properties: {
                user_id: {
                    type: "string",
                    example: "user1"
                },
            },
        }
    });
    addBodyFunction({
        name: "getUser",
        required: true,
        schema: {
            type: "object",
            properties: {
                user_id: {
                    type: "string",
                    example: "admin"
                },
            },
        }
    });

    addBodyFunction({
        name: "Token",
        required: true,
        schema: {
            type: "object",
            properties: {
                bank_name : {
                    type: "string",
                    example : "kisti"
                },
                name : {
                    type : "string",
                    example : "token_name"
                },
                admin : {
                    type : "string",
                    example: "admin1"
                },
                balance : {
                    type : "number",
                    example : 123
                },
                initialization_balance : {
                    type : "number",
                    example : 1
                },
                global_amount : {
                    type : "number",
                    example : 1919
                },
                inflation_policy : {
                    type : "string",
                    example : "policy"
                }

                }
        }
    });
    addBodyFunction({
        name: "generateBank",
        required: true,
        schema: {
            type: "object",
            properties: {
                user_id: {
                    type: "string",
                    example: "user1"
                },
                token_type: {
                    type: "string",
                    example: "ST"
                },
                token_quantitiy: {
                    type: "string",
                    example: "10000"
                }
            },
        }
    });
    addBodyFunction({
        name: "generateToken",
        required: true,
        schema: {
            type: "object",
            properties: {
                admin_id: {
                    type: "string",
                    example: "admin"
                },
                bank_name: {
                    type: "string",
                    example: "kisti"
                },
                token_type: {
                    type: "string",
                    example: "ST"
                },
                initialization_balance: {
                    type: "number",
                    example: 10000
                },
                ...INFLATION_POLICY_PROPERTIES
            },
        }
    });
    addBodyFunction({
        name: "inflate",
        required: true,
        schema: {
            type: "object",
            properties: {
                ...TOKEN_KEY_PROPERTIES
            }
        }
    });
    addBodyFunction({
        name: "inflationPolicy",
        required: true,
        schema: {
            type: "object",
            properties: {
                ...TOKEN_KEY_PROPERTIES,
                ...INFLATION_POLICY_PROPERTIES
            }
        }
    });
    addBodyFunction({
        name: "action",
        required: true,
        schema: {
            type: "object",
            properties: {
                user_id: {
                    type: "string",
                    example: "user1"
                },
                bank: {
                    type: "string",
                    example: "kisti"
                },
                action: {
                    type: "string",
                    example: "commit"
                }
            }
        }
    });
    addBodyFunction({
        name: "registerUser",
        required: true,
        schema: {
            type: "object",
            properties: {
                orcid: {
                    type: "string",
                    example: "0000-0002-8051-2166"
                },
                name: {
                    type: "string",
                    example: "Sol Kang"
                },
                password: {
                    type: "string",
                    example: "123456"
                }
            }
        }
    });

    addBodyFunction({
        name: "User",
        required: true,
        schema: {
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
        }
    });

    addBodyFunction({
        name: "LoginRequest",
        required: true,
        schema: {
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
        }
    });

    addBodyFunction({
        name: "orcid",
        required: true,
        schema: {
            type: "string",
            properties: {
                orcid: {
                    type : "string",
                    example : "pas123"
                }
            }
        }
    });

    addBodyFunction({
        name: "password",
        required: true,
        schema: {
            type: "string",
            properties: {
                password: {
                    type : "string",
                    example : "pas123"
                }
            }
        }
    });

    addBodyFunction({
        name: "ActionPolicy",
        required: true,
        schema: {
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
    });
    addBodyFunction({
        name: "Reward",
        required: true,
        schema: {
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
        }
    });


    addBodyFunction({
        name: "Transfer",
        required: true,
        schema: {
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
        }
    });
    addBodyFunction({
        name: "oauth",
        required: true,
        schema: {
            type: "object",
            properties: {
                code: {
                    type: "string",
                    example: "CD23D"
                },
            }
        }
    });
    addBodyFunction({
        name: "signinUser",
        required: true,
        schema: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    example: "sol@smartm2m.co.kr"
                },
                password: {
                    type: "string",
                    example: "123456"
                }
            }
        }
    });

//user Addbody
    addBodyFunction({
        name: "getUserJwt",
        required: true,
        schema: {
            type: "object",
            properties: {
                algorithm: {
                    type: "string",
                    example: "sha256"
                },
                key: {
                    type: "string",
                    example: "1234"
                },
            },
        },
        //aditionalProperties:true
    });

    addBodyFunction({
        name: "LongRequest",
        required: true,
        schema: {
            type: "object",
            properties: {
                orcid: {
                    type: "string",
                    example: "admin"
                },
                password: {
                    type: "string",
                    example: "adminpw"
                },
            },
        },
        //aditionalProperties:true
    });

    addBodyFunction({
        name: "getOauthInfo",
        required: true,
        schema: {
            type: "object",
            properties : {
                client_id:{
                    type : "string",
                    example : "smartm2m"
                },
                client_secret:{
                    type: "string",
                    example: "1234"
                },
                grant_type:{
                    type: "string",
                    example: "admin"
                },
                redirect_url:{
                    type:"string",
                    example:"org1.example.com"
                }
            }
        },
        //aditionalProperties:true
    });

    addBodyFunction({
        name: "OAuthRequest",
        required: true,
        schema: {
            type: "object",
            properties : {
                code :{
                    type: "string",
                    example: "CD23D"
                }
            }
        },
        //aditionalProperties:true
    });

    addBodyFunction({
        name: "makeJwt",
        required: true,
        schema: {
            type: "object",
            properties :{
                orcid:{
                    type: "string",
                    example: "smartm2m"
                },
                name: {
                    type: "string",
                    example: "yesol kim"
                }
            }
        },
        //aditionalProperties:true
    });

// jwt body function
    addBodyFunction({
        name: "fabricCheckJwt",
        required :true,
        schema : {
            type: "object",
            properties :{
                jwt : {
                    type: "string",
                    example : ""
                }
            }
        }
    });

    addBodyFunction({
        name: "checkJwt",
        required :true,
        schema : {
            type: "object",
            properties :{
                jwt : {
                    type: "string",
                    example : ""
                }
            }
        }
    })

// token body function

    addBodyFunction({
        name: "decodeJwt",
        required :true,
        schema : {
            type: "object",
            properties :{
                jwt : {
                    type: "string",
                    example : ""
                }
            }
        }
    });

    addBodyFunction({
        name: "getTokens",
        required :true,
        schema : {
            type: "object",
            properties :{
                bank_name : {
                    type: "string",
                    example : "kisti"
                },
                orcid :{
                    type: "string",
                    example : "id"
                }
            }
        }
    });

    addBodyFunction({
        name: "transferToken",
        required :true,
        schema : {
            type: "object",
            properties :{
                from: {
                    type: "string",
                    example: "user1"
                },
                to: {
                    type: "string",
                    example: "user2"
                },
                value: {
                    type: "number",
                    example: 100
                },
                token_type: {
                    type: "string",
                    example: "ST"
                }
            }
        }
    });

    addBodyFunction({
        name: "create",
        required :true,
        schema : {
            type: "object",
            properties : {
                token : {
                    type : "string"
                }
            }
            }
    });

    addBodyFunction({
        name: "update",
        required :true,
        schema : {
            type: "object",
            properties : {
                token : {
                    type : "string"
                }
            }
            }
    });

    addBodyFunction({
        name: "getTransactions",
        required :true,
        schema : {
            type: "object",
            properties : {
                token : {
                    type : "string"
                }
            }
            }
    });
    addBodyFunction({
        name: "deleteActions",
        required :true,
        schema : {
            type: "object",
            properties : {}
        }
    });

    addBodyFunction({
        name: "getActions",
        required :true,
        schema : {
            type: "object",
            properties : {
                token : {
                    type : "string"
                }
            }
            }
    });

}

