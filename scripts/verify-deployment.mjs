import { readFileSync } from 'node:fs';

const output = readFileSync('deployment-url.txt', 'utf8').trim();
const url = output.split(/\r?\n/).at(-1);
const endpoint = new URL('/api/health', url);

if (endpoint.protocol !== 'https:') {
  throw Error('Expected HTTPS deployment URL.');
}

const expectedCommit = process.env.GITHUB_SHA;
if (!expectedCommit) throw Error('GITHUB_SHA is missing.');

const headers = {
  'Cache-Control': 'no-cache',
  Accept: 'application/json'
};

if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  headers['x-vercel-protection-bypass'] =
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
}

console.log('Health endpoint:', endpoint.href);
console.log('Expected commit:', expectedCommit);

let lastResult = 'No response';

for (let attempt = 1; attempt <= 18; attempt++) {
  let response;
  let data;

  try {
    response = await fetch(endpoint, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(15000)
    });

    const body = await response.text();
    try {
      data = JSON.parse(body);
    } catch {
      data = null;
    }

    lastResult = JSON.stringify({
      httpStatus: response.status,
      status: data?.status ?? 'non-JSON response',
      commit: data?.commit ?? 'missing',
      code: data?.code ?? 'none'
    });
  } catch (error) {
    lastResult = `Connection error: ${error.message}`;
  }

  console.log(`Attempt ${attempt}: ${lastResult}`);

  if (
    response &&
    ([401, 403].includes(response.status) ||
      (response.status >= 300 && response.status < 400))
  ) {
    throw Error(
      'Deployment access blocked. Check Vercel Deployment Protection ' +
      'and the matching VERCEL_AUTOMATION_BYPASS_SECRET.'
    );
  }

  if (response?.status === 404) {
    throw Error(
      'Health route not found. Check Vercel Root Directory and API rewrites.'
    );
  }

  if (
    response?.ok &&
    data?.status === 'ok' &&
    data.commit === expectedCommit
  ) {
    console.log('Verified live API and exact tested commit.');
    process.exit(0);
  }

  if (attempt < 18) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

throw Error(`Deployment verification failed. Last result: ${lastResult}`);
