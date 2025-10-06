import bcrypt from 'bcryptjs';

async function generateAdminUser() {
  const email = 'admin@hellohome.com';
  const password = 'admin123';
  const name = 'Admin User';
  const role = 'admin';

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Generated SQL to create admin user:');
  console.log('-- Insert admin user with hashed password');
  console.log(`-- Password: ${password}`);
  console.log('INSERT INTO users (email, password, name, role) VALUES (');
  console.log(`    '${email}',`);
  console.log(`    '${hashedPassword}',`);
  console.log(`    '${name}',`);
  console.log(`    '${role}'`);
  console.log(') ON CONFLICT (email) DO NOTHING;');
  
  console.log('\nLogin credentials:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

generateAdminUser().catch(console.error);