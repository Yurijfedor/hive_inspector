import {runFullSync} from '../sync/runFullSync';
import {isOnline} from '../sync/isOnline';

export async function refreshAppData(uid: string): Promise<void> {
  console.log('🔄 APP REFRESH START');

  const online = await isOnline();

  if (!online) {
    console.log('📴 OFFLINE — LOCAL DATA REFRESH ONLY');
    return;
  }

  try {
    await runFullSync(uid);

    console.log('✅ APP REFRESH SYNC DONE');
  } catch (e) {
    console.log('⚠️ APP REFRESH SYNC FAILED:', e);

    // Refresh не повинен ламати UI,
    // якщо мережа зникла під час sync.
  }
}
