import { Express } from 'express-serve-static-core'
import { Api } from ".";
import { checkJwt } from '../thirdparty/jwt'
import { checkJwt as fabricCheckJwt} from '../thirdparty/fabric/user'
import swaggerDocument, { IInitializeOptions }  from "swagger-spec-express";
import swaggerUi from "swagger-ui-express";
import { Router } from 'express';
import { SwaggerJwtCheckDescription ,SwaggerCheckJwtDescription} from "./swagger/swagger-jwt"

export class JwtApi extends Api {
    constructor(app: Express) {
        super(app, '/jwt');
    }
    setRoute() {
        (<any>this.router.get('', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';

                const jwtResult = fabricCheckJwt({
                    jwt: jwtString
                });
                res.json(jwtResult);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerJwtCheckDescription
        );

        (<any>this.router.get('/register', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                await checkJwt({
                    jwt: jwtString
                });

                res.send('');
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerCheckJwtDescription
        );

        swaggerDocument.compile();
        this.app.use('/api-docs/jwt', swaggerUi.serve, swaggerUi.setup(swaggerDocument.json()))
    }
}
