// Using Web Crypto API available in Cloudflare Workers
const ALGORITHM = { name: 'PBKDF2' };
const HASH = 'SHA-256';
const ITERATIONS = 100000;
const SALT_LENGTH = 16; // bytes
const KEY_LENGTH = 64; // bytes
// Hashes a password with a new salt
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), ALGORITHM, false, ['deriveBits']);
  const hashBuffer = await crypto.subtle.deriveBits(
    { ...ALGORITHM, salt, iterations: ITERATIONS, hash: HASH },
    key,
    KEY_LENGTH * 8
  );
  const hash = new Uint8Array(hashBuffer);
  // Store as "salt:hash"
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}
// Verifies a password against a stored hash
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), ALGORITHM, false, ['deriveBits']);
  const hashBuffer = await crypto.subtle.deriveBits(
    { ...ALGORITHM, salt, iterations: ITERATIONS, hash: HASH },
    key,
    KEY_LENGTH * 8
  );
  const newHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return newHash === hashHex;
}