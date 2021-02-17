import { Express, Router } from 'express-serve-static-core'
import express from 'express'
import swaggerUi from "swagger-ui-express";
import swagger from 'swagger-spec-express'

export abstract class Api {
    app: Express
    router: Router

    constructor(app: Express, routerName: string) {
        this.app=app;
        this.router = express.Router();
        swagger.swaggerize(this.router);
        this.app.use(routerName, this.router);
        this.setRoute();
    }

    abstract setRoute(): void;
}
