// import { invoke, query } from '../../fabric/fabric-module';

// export interface User {
//     user_id : string,
//     password : string
// }

// export interface UserId {
//     user_id : string
// }

// export async function ChaincodeInvoke(channelName: string, chaincodeName: string, function_name : string ,user : string[]) {
//     let params=[function_name, JSON.stringify(user)];
//     var result = await invoke(channelName, chaincodeName, params);
//     return result;
// }

// export async function ChaincodeQuery(channelName: string, chaincodeName: string, function_name : string ,user : string[]) {
//     let params=[function_name, JSON.stringify(user)];
//     var result = await query(channelName, chaincodeName, params);
//     return result;
// }
