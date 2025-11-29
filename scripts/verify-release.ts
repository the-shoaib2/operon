import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 Starting Release Process Verification...');

try {
  // 1. Check for changesets
  console.log('\n📦 Checking for pending changesets...');
  const status = execSync('pnpm changeset status', { encoding: 'utf-8' });
  console.log(status);

  if (!status.includes('@repo/operone') || !status.includes('web')) {
    throw new Error('❌ Expected changesets not found!');
  }
  console.log('✅ Changesets detected correctly');

  // 2. Simulate version bump (dry run not fully supported by CLI, so we'll check logic)
  console.log('\n🔄 Verifying version bump logic...');
  const config = JSON.parse(fs.readFileSync('.changeset/config.json', 'utf-8'));
  
  if (config.linked[0].includes('@repo/operone') && config.linked[0].includes('@operone/ai')) {
    console.log('✅ Linked packages configured correctly');
  } else {
    throw new Error('❌ Linked packages configuration missing or incorrect');
  }

  // 3. Verify GitHub Actions workflow
  console.log('\nChecking GitHub Actions workflow...');
  const workflow = fs.readFileSync('.github/workflows/release.yml', 'utf-8');
  
  if (workflow.includes('changesets/action@v1') && workflow.includes('actions/create-release@v1')) {
    console.log('✅ Release workflow contains necessary actions');
  } else {
    throw new Error('❌ Release workflow missing critical steps');
  }

  if (workflow.includes('publish: pnpm changeset:publish')) {
    console.log('✅ Publish command configured');
  }

  // 4. Verify scripts in package.json
  console.log('\nChecking package.json scripts...');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  
  if (pkg.scripts.release && pkg.scripts.version && pkg.scripts['changeset:version']) {
    console.log('✅ Release scripts present');
  } else {
    throw new Error('❌ Missing release scripts in package.json');
  }

  console.log('\n✨ Release process verification passed!');
  console.log('Ready to push changes and trigger GitHub Actions.');

} catch (error: any) {
  console.error('\n❌ Verification Failed:', error.message);
  process.exit(1);
}
