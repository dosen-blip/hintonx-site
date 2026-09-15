import {execFileSync} from 'node:child_process';
import {mkdirSync, rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {assertRelease, repository, developmentURL} from './release-policy.mjs';
import {verifyDeployment} from './verify-deployment.mjs';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const {values} = parseArgs({options:{request:{type:'string'}, target:{type:'string', default:'development'}, check:{type:'boolean', default:false}}});
const env = {...process.env};
delete env.BASE_PATH;
env.CLOUDFLARE_ACCOUNT_ID = 'c2491bcbdd23a575e03d8dcf400800de';
const run = (command, args, input) => execFileSync(command, args, {encoding:'utf8', env, input, maxBuffer:20 * 1024 * 1024}).trim();
const git = (...args) => run('git', args);
const api = (path, body) => JSON.parse(run('gh', ['api', path, ...(body ? ['--method','POST','--input','-'] : [])], body ? JSON.stringify(body) : undefined));
const lock = resolve(git('rev-parse','--git-common-dir'), 'hintonx-release.lock');
let locked = false;
let deployment;
const status = (state, description, log_url) => api(`repos/${repository}/deployments/${deployment.id}/statuses`, {state, description, environment_url:developmentURL, ...(log_url ? {log_url} : {}), auto_inactive:false});
try {
  mkdirSync(lock); locked = true;
  const remote = git('remote','get-url','origin');
  if (![ `https://github.com/${repository}.git`, `git@github.com:${repository}.git` ].includes(remote)) throw new Error('Unexpected origin repository.');
  git('fetch','origin');
  const head = git('rev-parse','HEAD');
  const actor = api('user').login;
  const canPush = api(`repos/${repository}`).permissions?.push;
  const inspect = () => {
    if (git('rev-parse','HEAD') !== head) throw new Error('Local revision changed during release.');
    assertRelease({target:values.target, request:values.request, dirty:git('status','--porcelain'), branch:git('branch','--show-current'), head, remoteHead:git('ls-remote','origin','refs/heads/main').split(/\s/)[0], canPush});
  };
  inspect();
  console.log(run('npm', ['run','validate']));
  console.log(run('npx', ['wrangler','whoami']));
  const projects = JSON.parse(run('npx',['wrangler','pages','project','list','--json']));
  if (!projects.some(project => project['Project Name'] === 'hintonx-site')) throw new Error('Expected Pages project is unavailable.');
  if (values.check) { console.log(`Preflight passed for ${head}; no deployment created.`); }
  else {
    inspect();
    deployment = api(`repos/${repository}/deployments`, {ref:head, auto_merge:false, required_contexts:[], environment:'development', production_environment:false, description:values.request.slice(0,140), payload:{request:values.request, actor, authorization:'Standing development delivery authorization; not live-launch approval', target:developmentURL}});
    if (!deployment.id) throw new Error('GitHub did not create a deployment history record.');
    status('in_progress','Validated; uploading to the shared development site.');
    inspect();
    const output = run('npx', ['wrangler','pages','deploy','dist','--project-name=hintonx-site','--branch=main','--commit-hash',head]);
    console.log(output);
    const url = output.match(/https:\/\/[a-f0-9]+\.hintonx-site\.pages\.dev/)?.[0];
    if (!url) throw new Error('Upload returned no deployment URL; check Cloudflare before retrying.');
    console.log(await verifyDeployment('dist', url));
    console.log(await verifyDeployment('dist', developmentURL));
    status('success','Uploaded and all delivered file bytes verified.',url);
    console.log(`Release recorded: ${deployment.url}`);
  }
} catch (error) {
  if (deployment?.id) {
    try { status('failure','Release or verification failed; inspect Cloudflare before retrying.'); }
    catch { console.error(`Could not record failure; inspect GitHub deployment ${deployment.id}.`); }
  }
  console.error(error.message);
  process.exitCode = 1;
} finally { if (locked) rmSync(lock, {recursive:true}); }
