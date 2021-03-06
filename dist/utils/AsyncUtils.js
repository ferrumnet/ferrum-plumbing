"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalRetryConfig = {
    defaultTimeout: 300,
    maxTimeout: 600000,
    count: 3,
};
class RetryableError extends Error {
}
exports.RetryableError = RetryableError;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
async function retry(fun) {
    return retryWithConf(exports.globalRetryConfig, fun);
}
exports.retry = retry;
async function retryWithConf(conf, fun) {
    for (let i = 0; i < conf.count; i++) {
        try {
            const res = await fun();
            if (i > 0) {
                console.log(`Call succeeded after ${i} retries`);
            }
            return res;
        }
        catch (e) {
            if (e instanceof RetryableError) {
                // pass
                await sleep(Math.round(Math.random() * Math.min(conf.maxTimeout, conf.defaultTimeout * Math.pow(2, i))));
            }
            else {
                console.error('Retry failed all the attempts', i, e.message || e);
                throw e;
            }
        }
    }
}
exports.retryWithConf = retryWithConf;
//# sourceMappingURL=AsyncUtils.js.map