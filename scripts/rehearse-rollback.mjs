// Read-only rehearsal: reconstruct a known revision and compare it to its
// retained Pages deployment. This never switches the shared hostname.
import {execFileSync} from 'node:child_process';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseArgs} from 'node:util';
import {verifyDeployment} from './verify-deployment.mjs';
const {values} = parseArgs({options:{revision:{type:'string'}, deployment:{type:'string'}}});
if (!/^[a-f0-9]{40}$/.test(values.revision || '') || !values.deployment) throw new Error('Supply --revision FULL_SHA and --deployment HTTPS_URL.');
const folder = await mkdtemp(join(tmpdir(),'hintonx-rollback-'));
const env = {...process.env}; delete env.BASE_PATH;
try {
  const archive = execFileSync('git',['archive',values.revision], {maxBuffer:100 * 1024 * 1024});
  execFileSync('tar',['-xf','-','-C',folder],{input:archive});
  console.log(execFileSync('npm',['run','validate'],{cwd:folder,env,encoding:'utf8',maxBuffer:20 * 1024 * 1024}));
  console.log(await verifyDeployment(join(folder,'dist'), values.deployment));
  console.log(`Reconstructed ${values.revision}. Shared hostname was not changed.`);
} finally { await rm(folder,{recursive:true,force:true}); }
