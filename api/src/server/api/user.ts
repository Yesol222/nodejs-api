import { Express } from 'express-serve-static-core'
import { Api } from '.'
import { getOauthInfo } from '../thirdparty/oauth';
import { makeJwt, checkJwt } from '../thirdparty/jwt'
import { OAuthJwt } from '../rest/jwt';
import { Jwt } from '../rest/jwt';
import { OAuthRequest, LoginRequest, User } from '../rest/user';
import { User as FabricUser, getUserJwt } from '../thirdparty/fabric/user';
import swaggerDocument, { IInitializeOptions }  from "swagger-spec-express";
import swaggerUi from "swagger-ui-express";
import { SwaggerSignUpDescription, SwaggerSignInDescription, SwaggerOAuthDescription} from './swagger/swagger-user'


export class UserApi extends Api {
    constructor(app: Express) {
        super(app, '/user');
    }

    setRoute() {
        (<any>this.router.post('/signup', async (req, res) => {
            try {
                let body = req.body as User;
                let user = new FabricUser(body);
                let regiserResult = await user.registerUser();
                res.status(200);
                res.json(regiserResult);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerSignUpDescription
        );

        (<any>this.router.post('/signin', async (req,res) => {
            try {
                let loginRequest = req.body as LoginRequest;
                let userJwt = await getUserJwt(loginRequest);
                res.status(200);
                res.json(userJwt);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerSignInDescription
        );

        (<any>this.router.post('/oauth', async (req, res) => {
            try {
                let body = req.body as OAuthRequest;
                let userData = await getOauthInfo(body.code);
                let oauthJwt: OAuthJwt = {
                    name: userData.name,
                    orcid: userData.orcid,
                }
                let jwtToken = makeJwt(oauthJwt);
                let jwt: Jwt = {
                    jwt: jwtToken,
                };
                res.send(jwt);
            } catch (err) {
                res.status(500);
                res.send(err);
            }
        })).describe(
            SwaggerOAuthDescription
        )

        swaggerDocument.compile();
        this.app.use('/api-docs/user', swaggerUi.serve, swaggerUi.setup(swaggerDocument.json()))
    }
}
