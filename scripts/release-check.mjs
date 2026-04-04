import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();

const checks = [];
const warnings = [];

function pass(message) {
  checks.push({ type: 'pass', message });
}

function fail(message) {
  checks.push({ type: 'fail', message });
}

function warn(message) {
  warnings.push(message);
}

function readJson(file) {
  return JSON.parse(readFileSync(path.join(root, file), 'utf8'));
}

function ensureFile(file, label = file) {
  if (existsSync(path.join(root, file))) {
    pass(`${label} presente`);
    return true;
  }

  fail(`${label} ausente`);
  return false;
}

function runBuild() {
  try {
    execSync('npm run build', { cwd: root, stdio: 'pipe' });
    pass('build de produção passou');
  } catch (error) {
    fail('build de produção falhou');
  }
}

function checkManifest() {
  const manifest = readJson('manifest.json');

  if (manifest.name === 'Bola na Rede Manager') pass('manifest com nome do produto alinhado');
  else fail('manifest com nome inconsistente');

  if (manifest.start_url === '/' && manifest.scope === '/') pass('manifest configurado para raiz do app');
  else fail('manifest com start_url/scope incorretos');

  if (Array.isArray(manifest.icons) && manifest.icons.length > 0) pass('manifest com ícones definidos');
  else fail('manifest sem ícones');
}

function checkMetadata() {
  const metadata = readJson('metadata.json');

  if (metadata.name === 'Bola na Rede Manager') pass('metadata com nome do produto alinhado');
  else fail('metadata com nome inconsistente');

  if (typeof metadata.description === 'string' && metadata.description.toLowerCase().includes('brasileiro')) {
    pass('metadata com descrição pública adequada');
  } else {
    fail('metadata com descrição genérica');
  }
}

function checkVercelConfig() {
  const vercelRaw = readFileSync(path.join(root, 'vercel.json'), 'utf8');
  const vercel = JSON.parse(vercelRaw);

  if (Array.isArray(vercel.rewrites) && vercel.rewrites.some((entry) => entry.destination === '/index.html')) {
    pass('rewrite SPA configurado');
  } else {
    fail('rewrite SPA ausente');
  }

  if (vercelRaw.includes('Content-Security-Policy')) pass('headers de segurança configurados');
  else fail('headers de segurança ausentes');
}

function checkGitState() {
  try {
    const status = execSync('git status --short', { cwd: root, stdio: 'pipe' }).toString().trim();
    if (!status) {
      pass('workspace limpo para release');
      return;
    }

    warn('workspace com mudanças locais pendentes');
  } catch {
    warn('não foi possível verificar estado do git');
  }
}

function checkEnvExample() {
  const envPath = path.join(root, '.env.example');
  if (!existsSync(envPath)) {
    fail('.env.example ausente');
    return;
  }

  const env = readFileSync(envPath, 'utf8');
  if (env.includes('VITE_SUPABASE_URL') && env.includes('VITE_SUPABASE_ANON_KEY')) {
    pass('.env.example documenta variáveis críticas');
  } else {
    fail('.env.example incompleto');
  }
}

runBuild();
ensureFile('index.html');
ensureFile('manifest.json');
ensureFile('metadata.json');
ensureFile('vercel.json');
ensureFile('public/robots.txt', 'robots.txt público');
ensureFile('public/social-cover.svg', 'social cover pública');
checkManifest();
checkMetadata();
checkVercelConfig();
checkEnvExample();
checkGitState();

for (const check of checks) {
  const marker = check.type === 'pass' ? 'PASS' : 'FAIL';
  console.log(`${marker} ${check.message}`);
}

for (const warning of warnings) {
  console.log(`WARN ${warning}`);
}

const failed = checks.some((check) => check.type === 'fail');
if (failed) {
  process.exit(1);
}
