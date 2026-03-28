export const retry: any = async (fn: any, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (err) {
        if (retries === 0) throw err;

        await new Promise((res) => setTimeout(res, delay));
        return retry(fn, retries - 1, delay);
    }
};