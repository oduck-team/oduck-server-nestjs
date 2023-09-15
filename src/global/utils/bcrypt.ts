import * as bcrypt from 'bcrypt';
export async function hashPassword(password: string): Promise<string> {
  const SALT = await bcrypt.genSaltSync();

  return await bcrypt.hash(password, SALT);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
