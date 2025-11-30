/**
 * Create database script
 * Creates the space_mood_oracle database if it doesn't exist
 */

import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get database connection string from environment
// If DATABASE_URL includes database name, we'll extract it
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.error('\n📝 以下のいずれかの方法で設定してください:');
  console.error('   1. .env ファイルを作成して DATABASE_URL を設定');
  console.error('   2. 環境変数として設定');
  console.error('\n例:');
  console.error('   DATABASE_URL=mysql://root:password@localhost:3306');
  console.error('\n注意: データベース名は含めないでください（自動的に作成されます）');
  process.exit(1);
}

async function createDatabase() {
  let connection;
  
  try {
    // Parse DATABASE_URL to get connection info without database name
    const url = new URL(DATABASE_URL);
    const host = url.hostname;
    const port = url.port || 3306;
    const user = url.username;
    const password = url.password;
    
    // Connect without specifying database
    console.log('🔗 Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
    });
    console.log('✅ Connected to MySQL server');

    const dbName = 'space_mood_oracle';
    
    console.log(`\n📦 Creating database: ${dbName}...`);
    
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
    
    console.log(`✅ Database '${dbName}' created successfully!`);
    
    // Switch to the new database
    await connection.execute(`USE \`${dbName}\``);
    console.log(`✅ Switched to database '${dbName}'`);
    
    // List existing tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`\n📋 Existing tables: ${tables.length}`);
    if (tables.length > 0) {
      tables.forEach((table) => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
    } else {
      console.log('   (No tables yet)');
    }
    
    console.log('\n🎉 Database setup completed!');
    console.log('\n次のステップ:');
    console.log('   マイグレーション実行: マイグレーション実行SQL.sql を実行してテーブルを作成');
    
  } catch (error) {
    console.error('\n❌ Failed to create database:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 データベースサーバーに接続できません。以下を確認してください:');
      console.error('   1. MySQL/MariaDBサーバーが起動しているか');
      console.error('   2. ホスト名・ポート番号が正しいか');
      console.error('   3. ファイアウォール設定');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 アクセスが拒否されました。以下を確認してください:');
      console.error('   1. ユーザー名・パスワードが正しいか');
      console.error('   2. データベース作成権限があるか');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

createDatabase();

