import { Express } from 'express-serve-static-core'
import { Api } from ".";
import { Action, getActions, deleteActions, action } from '../thirdparty/fabric/action';
import { ActionPolicy, Reward } from '../rest/action';
import { decodeJwt } from '../thirdparty/jwt';
import { checkJwt } from '../thirdparty/jwt'
import { checkJwt as fabricCheckJwt} from '../thirdparty/fabric/user'
import swaggerDocument from "swagger-spec-express";
import swaggerUi from "swagger-ui-express";
import {SwaggerRewardActionDescription, SwaggerActionPolicyCreateDescription, SwaggerActionPolicyUpdateDescription, SwaggerActionDeleteTokenDescription,SwaggerGetActionDescription} from './swagger/swagger-action'

export class ActionApi extends Api {
    constructor(app: Express) {
        super(app, '/action');
    }
    setRoute(): void {
        (<any>this.router.post('/reward', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                const jwtData = decodeJwt(jwtString);
                const admin = jwtData['orcid'];
                const body = req.body as Reward;
                const result = await action(body.bank_name, body.action_type, admin, body.user);

                res.json(result);
            } catch(err) {
                res.status(400);
                res.send(err);
            }
         })).describe(
            SwaggerRewardActionDescription
        );

        (<any>this.router.post('/policy', async (req, res) => {
            //ActionPolicy
            try {
                const actionRequest = req.body as ActionPolicy;
                const action = new Action(actionRequest)
                const result = await action.create();

                res.send('');
            } catch (err) {
                res.status(400);
                res.send(err);
            }
         })).describe(
            SwaggerActionPolicyCreateDescription
        );

        (<any>this.router.put('/', async (req, res) => {
            try {
                const actionRequest = req.body as ActionPolicy;
                const action = new Action(actionRequest)
                const result = await action.update();

                res.send('');
            } catch (err) {
                res.status(400);
                res.send(err);
            }
         })).describe(
            SwaggerActionPolicyUpdateDescription
        );

        (<any>this.router.delete('/:bankName/:tokenName', async (req, res) => {
            try {
                const result = await deleteActions(req.params.bankName, req.params.tokenName);
                res.json(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
         })).describe(
            SwaggerActionDeleteTokenDescription
        );

        (<any>this.router.get('/:bankName', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                await checkJwt({
                    jwt: jwtString
                });
                const bankName = req.params.bankName;
                const result = await getActions(bankName);

                res.json(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerGetActionDescription
        );
        swaggerDocument.compile();
        this.app.use('/api-docs/user', swaggerUi.serve, swaggerUi.setup(swaggerDocument.json()))
    }
}
