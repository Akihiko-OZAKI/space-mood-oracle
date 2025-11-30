/**
 * Run migration SQL file
 * Executes the migration SQL file to create new tables
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.error('Please set DATABASE_URL in your .env file or environment variables');
  process.exit(1);
}

const migrationFile = join(__dirname, '../drizzle/0003_trend_analysis_tables.sql');

async function runMigration() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Connected to database');

    console.log('📖 Reading migration file...');
    const sql = await readFile(migrationFile, 'utf-8');
    console.log('✅ Migration file loaded');

    // Split SQL by statement breakpoints
    const statements = sql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement || statement.length < 10) continue;

      console.log(`\n📋 Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        await connection.execute(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        // If table already exists, that's okay
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.message?.includes('already exists')) {
          console.log(`⚠️  Table already exists (skipping)`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          throw error;
        }
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nCreated tables:');
    console.log('  - google_trend_data');
    console.log('  - twitter_trend_data');
    console.log('  - daily_mood_judgment');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

runMigration();

