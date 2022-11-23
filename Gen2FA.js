const crypto = require('crypto');

class Gen2FA {
    constructor(periods, period_length, key_str) {
        this.periods = (periods === null || periods === undefined) ? 1 : (periods <= 0 ? 1 : periods);
        this.period_length = (period_length === null || period_length === undefined) ? (60 * 1000) : (period_length <= 0 ? (60 * 1000) : period_length);
        this.key = key_str;
    }

    makeCode(ts, uid) {
        const hmac = crypto.createHmac('sha256', this.key);
        hmac.update(`${uid}`);
        hmac.update(Math.floor(ts.getTime() / this.period_length).toString());
        const buf = hmac.digest();
        const digits = buf.readUInt32BE(buf.length - 4);
        return `${digits}`.slice(0, 6).padStart(6, '0');
    }

    make2FA(uid) {
        return this.makeCode(new Date(), uid);
    }

    check2FA(token, uid) {
        if (token.length === 6) {
            
            const ts = new Date();
            for (let curr = 0; curr <= this.periods; curr++) {
                const t = new Date(ts.getTime() - (curr * this.period_length));
                const code = this.makeCode(t, uid);
                if (crypto.timingSafeEqual(Buffer.from(code, 'utf8'), Buffer.from(token, 'utf8'))) {
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = Gen2FA;