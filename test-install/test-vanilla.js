// Test vanilla JS usage
import * as Analytics from '@click-chutney/analytics';

console.log('✅ Analytics import successful');
console.log('Available exports:', Object.keys(Analytics));

// Test initialization
try {
  Analytics.default.init('cc_test_123');
  console.log('✅ Analytics.default.init() works');
} catch (e) {
  console.log('❌ Analytics init failed:', e.message);
}

console.log('✅ Vanilla JS test complete');