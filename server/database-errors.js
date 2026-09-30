export function databaseIssue(error) {
 const code = error.code ?? error.cause?.code;
 if (String(code).startsWith('CONFIG_')) return { code, action: error.message };
 if (code === 18 || error.codeName === 'AuthenticationFailed') return {code:'DB_AUTH', action:'Check Atlas database username/password and percent-encode special password characters in MONGO_URI.'};
 if (code === 13 || error.codeName === 'Unauthorized') return {code:'DB_PERMISSION', action:'Give the Atlas database user readWrite access to the selected MONGO_DB_NAME.'};
 if (code === 11000) return {code:'DB_DUPLICATE', action:'Existing duplicate records prevent a unique index. Inspect database records before fixing; do not delete data blindly.'};
 if (/ServerSelection|Network|Timeout/.test(error.name || '') || ['ENOTFOUND','ECONNREFUSED','ETIMEOUT','ETIMEDOUT'].includes(code)) return {code:'DB_NETWORK', action:'Check Atlas cluster status, hostname and Network Access for the machine or hosting provider.'};
 return {code:'DB_INIT', action:'Database initialization failed. Check the sanitized error code in the server logs.'};
}
export function logDatabaseError(error, phase = 'startup') {
 const issue = databaseIssue(error);
 console.error('Shoplane database initialization failed:', {phase, name:error.name, code:error.code, codeName:error.codeName, diagnostic:issue.code, action:issue.action});
 return issue;
}
