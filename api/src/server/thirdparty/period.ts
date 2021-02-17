import { scheduleJob, Job } from 'node-schedule'


const PERIODS: Map<string, Job> = new Map<string, Job>();

const makeKey = (bankName: string, tokenType: string) => `${bankName}__${tokenType}`;

export function setPeriod(orcid: string, bankName: string, tokenType: string, corn: string, fun: (orcid: string, bankName: string, tokenType: string) => void) {
    const event = fun.bind(null, orcid, bankName, tokenType);
    const j = scheduleJob(corn, event);
    const key = makeKey(bankName, tokenType);
    const pastJob = PERIODS.get(key);
    if (pastJob) {
        console.log("cancel job: ", key)
        pastJob.cancel();
    }
    console.log("create job: ", key)
    PERIODS.set(key, j);
}
