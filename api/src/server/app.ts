import express, { Router } from "express"
import bodyParser from "body-parser"
import swaggerUi from "swagger-ui-express";
import swaggerDocument, { IInitializeOptions } from 'swagger-spec-express'
import pjson from 'pjson'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import { enrollAdmin, enrollUser, generateToken, version, getUserInfo, getToken, tokenTransfer, inflate, inflationPolicy, action, actionPolicy, registerUser, signinUser } from "./fabric"
import { addBody } from "./api/swagger/swagger-body";
import { addPath } from "./api/swagger/swagger-path";
import { addModel } from "./api/swagger/swagger-model";
import { addHeader } from "./api/swagger/swagger-header";
import {invoke, query} from "../fabric/fabric-module";
import { decisionResult } from './thirdparty/fabric/common';
import { configure } from '../common/config';
import { LoginRequest } from "./rest/user";

const JWT_SECRET = "secret";
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options: IInitializeOptions = {
    title: pjson.name,
    version: "0.1.1",
    basePath : "/",
};

swaggerDocument.initialise(app, options);

addBody(swaggerDocument.common.parameters.addBody);
addPath(swaggerDocument.common.parameters.addPath);
addModel(swaggerDocument.common.addModel);
addHeader(swaggerDocument.common.parameters.addHeader);

function makeResultType(result: object | string, success: boolean) {
    if (!(result as string)) {

        result = JSON.stringify(result, null, 2);
    }
    return {
        msg: result,
        isSuccess: success
    };
}

(<any>app.get('/version', async (req, res) => {
    const result = await version();

    res.send(`api version: ${pjson.version}\nchaincode version: ${result}`);
})).describe({
    tags : ["version"],
    responses: {
        200: {
            description: "get version"
        }
    }
});

(<any>app.post('/invoke', async (req, res) => {
    try{
        const jwtString = req.header('Authorization') || '';
        const args = JSON.stringify(req.body.args);
        const params = []
        params[0] = JSON.stringify(jwtString)
        params[1] = args
        const function_name = req.body.function_name;

        var invokeResult = await invoke(configure.CHANNEL_NAME, configure.CHAINCODE_NAME, function_name , params);
        const result = decisionResult(invokeResult);

        res.status(200);
        res.send(result);
    }
    catch(err){
        res.status(400)
        res.send(err+"ER")
    }
})).describe({
    tags : ["version"],
    responses: {
        200: {
            description: "get version"
        }
    }
});

(<any>app.post('/query', async (req, res) => {
    try{
        const jwtString = req.header('Authorization') || '';
        const args = JSON.stringify(req.body.args);

        const params = []
        params[0] = JSON.stringify(jwtString)
        params[1] = args
        const function_name = req.body.function_name;

        var queryResult = await query(configure.CHANNEL_NAME, configure.CHAINCODE_NAME, function_name , params);
        const result = decisionResult(queryResult);

        res.status(200);
        res.send(result);
    }
    catch(err){
        res.status(400)
        res.send(err+"ER")
    }
})).describe({
    tags : ["version"],
    responses: {
        200: {
            description: "get version"
        }
    }
});


(<any>app.post('/jwt/invoke', async (req, res) => {
    try{
        const function_name = req.body.function_name;
        const channel_id = "mychannel";
        const chaincode_name = "mycc";
        var paramswithjwt = []
        let jwt = req.body.jwt;
        paramswithjwt[0] = jwt
        paramswithjwt[1] = JSON.stringify(req.body.args)
        let params = [function_name, ...paramswithjwt];
        var result = await invoke(channel_id, chaincode_name, function_name, params);
        console.log(req.body.function_name);
        res.status(200);
        res.send(result);
    }
    catch(err){
        res.status(400)
        res.send(err+"ER")
    }
})).describe({
    tags : ["version"],
    responses: {
        200: {
            description: "get version"
        }
    }
});

swaggerDocument.compile();
export const swaggerResult = swaggerDocument.json();

var result = swaggerDocument.validate();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument.json()))

export default app;