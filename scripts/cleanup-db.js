#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Removes duplicate collections created by Better Auth lowercase naming
 * Keeps Prisma PascalCase collections as the source of truth
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function cleanupDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable not found');
    process.exit(1);
  }

  const client = new MongoClient(dbUrl);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('DEV');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Current collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Collections to remove (Better Auth lowercase duplicates)
    const collectionsToRemove = ['user', 'account', 'session', 'verification'];
    
    console.log('\n🗑️  Removing duplicate collections...');
    
    for (const collectionName of collectionsToRemove) {
      try {
        const collectionExists = collections.find(col => col.name === collectionName);
        
        if (collectionExists) {
          // Get document count before removal
          const count = await db.collection(collectionName).countDocuments();
          console.log(`  📊 ${collectionName}: ${count} documents`);
          
          // Drop the collection
          await db.collection(collectionName).drop();
          console.log(`  ✅ Removed collection: ${collectionName}`);
        } else {
          console.log(`  ⏭️  Collection not found: ${collectionName}`);
        }
      } catch (error) {
        console.log(`  ⚠️  Error removing ${collectionName}:`, error.message);
      }
    }
    
    // List collections after cleanup
    const finalCollections = await db.listCollections().toArray();
    console.log('\n📋 Final collections:');
    finalCollections.forEach(col => console.log(`  - ${col.name}`));
    
    console.log('\n✨ Database cleanup completed!');
    console.log('\n🎯 Remaining collections (Prisma PascalCase):');
    console.log('  - User (main user model)');
    console.log('  - Account (OAuth accounts)');
    console.log('  - Session (user sessions)');
    console.log('  - Project (analytics projects)');
    console.log('  - AnalyticsEvent (event tracking)');
    console.log('  - ProjectStats (aggregated stats)');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the cleanup
cleanupDatabase();