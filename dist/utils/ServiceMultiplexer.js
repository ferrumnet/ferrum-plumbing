"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidationUtils_1 = require("./ValidationUtils");
const AsyncUtils_1 = require("./AsyncUtils");
const TEN_MINUTES = 10 * 60 * 1000;
/**
 * Multiplexes a service. Uses different providers in order.
 * Algo:
 *  1. Use the first provider.
 *  2. In case first provider does not respond, caller will call `next`.
 *  3. There would be an exponential fallback for each ID.
 *  4. Next get, fall back to the first item that is available
 */
class ServiceMultiplexer {
    constructor(providers, logFac, dontRetryError, mode = 'one-hot') {
        this.dontRetryError = dontRetryError;
        this.mode = mode;
        this.index = 0;
        this.providers = [];
        ValidationUtils_1.ValidationUtils.isTrue(!!providers && providers.length >= 1, 'At least one provider is required');
        providers.forEach(p => {
            this.providers.push({
                func: p,
                nextCallTimeout: 0,
                errorBuffer: 0,
                errors: 0,
                burstErrors: 0,
            });
        });
        this.get = this.get.bind(this);
        this.failed = this.failed.bind(this);
        this.log = logFac.getLogger(ServiceMultiplexer);
    }
    __name__() { return 'ServiceMultiplexer'; }
    updateMode(mode) {
        this.mode = mode;
    }
    /**
     * Returns the current provider. If the current provider has not changed, will reset the retries
     */
    get() {
        // Run through the providers and get first first
        const now = Date.now();
        const coolIdxs = this.providers.map((p, i) => ({ p, i })).filter(pi => pi.p.nextCallTimeout <= now).map(pi => pi.i);
        let firstCoolIdx = coolIdxs.length ? coolIdxs[0] : -1;
        if (coolIdxs.length && this.mode === 'load-balance') {
            firstCoolIdx = Math.trunc(Math.random() * coolIdxs.length);
        }
        let firstCool = this.providers[0];
        this.index = 0;
        if (firstCoolIdx >= 0) {
            firstCool = this.providers[firstCoolIdx];
            this.index = firstCoolIdx;
            firstCool.errors = 0; // TODO: This should only be done if using the index is successful
            firstCool.burstErrors = 0;
            firstCool.nextCallTimeout = now;
        }
        return firstCool.func();
    }
    async failed() {
        // When the calls are in bulk and parallel, this logic wont work.
        const current = this.providers[this.index];
        const now = Date.now();
        if (current.errorBuffer <= now) {
            current.errors += 1;
            current.nextCallTimeout = now +
                Math.round(Math.random() * Math.min(TEN_MINUTES, (2 ** current.errors) * 400));
            current.errorBuffer = now + 300;
        }
        else {
            current.burstErrors += 1;
            const wait = Math.min(TEN_MINUTES / 10, current.burstErrors * 100 * (2 ** current.errors));
            await AsyncUtils_1.sleep(Math.round(Math.random() * wait));
        }
    }
    async retryAsync(fun) {
        return AsyncUtils_1.retry(async () => {
            try {
                const t = this.get();
                return await fun(t);
            }
            catch (e) {
                if (this.dontRetryError && this.dontRetryError(e)) { // If the error is deterministic
                    throw e;
                }
                await this.failed();
                this.log.error('retryAsync: ', e.message || e);
                throw new AsyncUtils_1.RetryableError(e.message);
            }
        });
    }
}
exports.ServiceMultiplexer = ServiceMultiplexer;
//# sourceMappingURL=ServiceMultiplexer.js.map