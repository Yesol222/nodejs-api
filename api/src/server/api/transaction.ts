import { Express } from 'express-serve-static-core'
import { Api } from ".";
import { getTransactions } from "../thirdparty/fabric/transaction";
import swaggerDocument, { IInitializeOptions }  from "swagger-spec-express";
import swaggerUi from "swagger-ui-express";
import { Router } from 'express';
import { SwaggerGetTransaction} from "./swagger/swagger-transaction"

export class TransactionApi extends Api {
    constructor(app: Express) {
        super(app, '/transaction');
    }

    setRoute(): void {
        (<any>this.router.get('/:bankName', async (req, res) => {
            try {
                const jwtString = req.header('Authorization') || '';
                const bankName = req.params.bankName;
                const result = await getTransactions(bankName);
                res.json(result);
            } catch (err) {
                res.status(400);
                res.send(err);
            }
        })).describe(
            SwaggerGetTransaction
        )
        swaggerDocument.compile();
        this.app.use('/api-docs/jwt', swaggerUi.serve, swaggerUi.setup(swaggerDocument.json()))
    }
}
