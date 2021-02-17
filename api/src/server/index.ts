import expressApp from "./app";
import { UserApi } from './api/user'
import { JwtApi } from "./api/jwt";
import { TokenApi } from "./api/token";
import { TransactionApi } from "./api/transaction";
import { ActionApi } from "./api/action";

new UserApi(expressApp);
new JwtApi(expressApp);
new TokenApi(expressApp);
new TransactionApi(expressApp);
new ActionApi(expressApp);

export const app = expressApp;

