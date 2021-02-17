import { Express } from 'express-serve-static-core'
import { Api } from ".";
import { Token, Transfer } from '../rest/token';
import { Token as FabricToken, getTokens, inflate, transferToken } from '../thirdparty/fabric/token';
import { checkJwt } from '../thirdparty/fabric/user';
import { decodeJwt } from '../thirdparty/jwt';
import { transfer } from '../../fabric/go-api';
import { Exchange, getExchanges, deleteExchange, exchange } from '../thirdparty/fabric/exchange';
import { ExchangePolicy, ExchangeRequest } from '../rest/exchange';
import swaggerDocument, { IInitializeOptions }  from "swagger-spec-express";
import swaggerUi from "swagger-ui-express";

import { Router } from 'express';
import { SwaggerTokenGenerateDescription, SwaggerTokenTransferDescription ,SwaggerGetTokenDescription , SwaggerInflateDescription} from './swagger/swagger-token'

export class TokenApi extends Api {
    constructor(app: Express) {
        super(app, '/token');
    }

    setRoute(): void {
        (<any>this.router.get('/:bankName', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                const jwtData = decodeJwt(jwtString);
                const bankName = req.params.bankName;
                console.log(bankName)
                const result = await getTokens(JSON.stringify(jwtString), bankName);
                res.status(200);
                res.send(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerGetTokenDescription
        );

        (<any>this.router.post('', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                const tokenRequest = req.body as Token;
                const token = new FabricToken(tokenRequest);
                const generateResult = await token.generate(jwtString);
                res.status(200);
                res.send(generateResult)
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerTokenGenerateDescription
        );

        (<any>this.router.post('/transfer', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                const jwtData = decodeJwt(jwtString);

                const transferRequest = req.body as Transfer;
                const result = await transferToken(transferRequest);

                res.json(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerTokenTransferDescription
        );

        (<any>this.router.post('/inflation/:bankName/:tokenName', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                const jwtData = decodeJwt(jwtString);
                const bankName = req.params.bankName;
                const tokenName = req.params.tokenName;

                const result = inflate(jwtData['orcid'], bankName, tokenName);
                res.send(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerInflateDescription
        );

        //TODO:j
        this.router.post('/exchange', async (req, res) => {
            try {
                const exchagneRequest = req.body as ExchangeRequest;
                const result = await exchange(exchagneRequest);
                res.json({});
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        });

        this.router.post('/exchange/policy', async(req, res) => {
            try {
                const exchagneRequest = req.body as ExchangePolicy;
                const exchagne= new Exchange(exchagneRequest);
                const result = await exchagne.create();

                res.json({
                    exchange_policies: [result],
                });
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        });

        this.router.put('/exchange/policy', async (req, res) => {
            try {
                const exchagneRequest = req.body as ExchangePolicy;
                console.log(exchagneRequest)
                const exchagne= new Exchange(exchagneRequest);
                const result = await exchagne.update();

                res.json(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        });

        this.router.get('/exchange/policy/:bankName', async (req, res) =>{
            try {
                const jwtString = req.header('Authorization') || '';
                const bankName = req.params.bankName;
                const result = await getExchanges(bankName);

                res.json(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        });

        this.router.delete('/exchange/policy/:bankName/:token1/:token2', async (req, res) => {
            try {
                const bankName = req.params.bankName;
                const token1Name = req.params.token1;
                const token2Name = req.params.token2;
                const result = await deleteExchange(bankName, token1Name, token2Name);

                res.json(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }

        });

        swaggerDocument.compile();
        this.app.use('/api-docs/jwt', swaggerUi.serve, swaggerUi.setup(swaggerDocument.json()))
    }
}
