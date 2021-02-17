import request from 'request';
import { configure } from "../../common/config";

export interface OrcidOauthResponse {
	orcid: string
	name: string
	access_token: string
	token_type: string
	bearer: string
	refresh_token: string
	expires_in: number
	scope: string
}

export async function getOauthInfo(code: string): Promise<OrcidOauthResponse> {
    const headers = {
        'Accept': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded"
    };
    //const dataString = `client_id=${configure.ORCID_CLIENT_ID}&client_secret=${configure.ORCID_CLIENT_SECRET}&grant_type=${configure.ORCID_GRANT_TYPE}&redirect_uri=${configure.ORCID_REDIRECT_URI}&code=${code}`;
    const dataString = `client_id=APP-JVYXD8SAQJD8J4PJ&client_secret=584c22c6-2378-4e52-94dd-fb24b1407ecf&grant_type=authorization_code&redirect_uri=http://172.30.1.140:4200/oauth&code=${code}`
    var options = {
        url: 'https://orcid.org/oauth/token',
        method: 'POST',
        headers: headers,
        body: dataString,
    };

    return new Promise((res, rej) => {
        request(options, (err, httpResponse, body) => {
            if (err) {
                rej(err);
                console.log("fail its error from orcid")
            } else {
                body = JSON.parse(body)
                if (!!body.error) {
                    rej(body)
                } else {
                    res(body as OrcidOauthResponse);
                }
            }
        });
    });

}