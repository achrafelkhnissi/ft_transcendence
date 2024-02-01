import bcrypt from 'bcryptjs';

const saltRounds = 10; // Number of salt rounds for hashing

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};