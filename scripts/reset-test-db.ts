import { execSync } from 'child_process';

export default async () => {
  console.log('\nResetting test database...');
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
  console.log('Test database reset complete.');
};
