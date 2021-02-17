export function decisionResult(result: any, decision: boolean = result.code == 0 ): any {
    if (decision) {
        return result.message;
    } else {
        throw result.message || result;
    }
}