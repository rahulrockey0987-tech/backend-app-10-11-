
import 'dotenv/config';
import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectMongoDB } from '../db/mongo';
import Admin from '../models/Admin';

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY || !process.stdin.setRawMode) {
      resolve('');
      return;
    }

    process.stdout.write(question);
    let answer = '';

    const onData = (data: Buffer) => {
      const key = data.toString();

      if (key === '\r' || key === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(answer);
      } else if (key === '\u0003') {
        process.exit(1);
      } else if (key === '\u007f' || key === '\b') {
        answer = answer.slice(0, -1);
      } else if (key >= ' ') {
        answer += key;
      }
    };

    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.on('data', onData);
  });
}

async function main() {
  try {
    await connectMongoDB();

    const existingSuperAdmin = await Admin.findOne({
      role: 'super_admin',
    });

    if (existingSuperAdmin) {
      throw new Error(
        'A Super Admin already exists. Setup cannot create another one.'
      );
    }

    const name = await ask('Super Admin name: ');
    const email = (await ask('Super Admin email: ')).toLowerCase();
    const password = await askHidden('Super Admin password (hidden): ');

    if (!name || !email || !password) {
      throw new Error('Name, email and password are required.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email address.');
    }

    if (password.length < 12) {
      throw new Error('Password must contain at least 12 characters.');
    }

    const existingEmail = await Admin.findOne({ email });

    if (existingEmail) {
      throw new Error('An admin with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name,
      email,
      passwordHash,
      role: 'super_admin',
      branch: 'All Branches',
      isActive: true,
    });

    console.log('\nSuper Admin created successfully.');
    console.log('Admin ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
  } catch (error) {
    console.error('\nSetup failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
