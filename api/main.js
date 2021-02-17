const { app } = require('./lib/server');
const { configure } = require('./lib/common/config')
const { enrollAdmin }  = require('./lib/fabric/ca')


const rimraf = require('rimraf');

async function main() {
    rimraf("./wallet", async() => {
        const enrollment = await enrollAdmin('admin', 'adminpw','Org1MSP',"ca.kisti.re.kr")
            if (enrollment) {
                console.error("error");
                process.exit(-1);
            }
        }),
    app.listen(configure.PORT, () => {
        console.log(`App is running at http://localhost:${configure.PORT}`)
    });
    console.log("  Press CTRL-C to stop\n");
}

main();
