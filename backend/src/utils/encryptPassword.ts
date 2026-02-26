import bcrypt from 'bcrypt';

export const encrypt = async (textPlain: string): Promise<string> => {
  return await bcrypt.hash(textPlain, 10);
};

export const compare = async (
  textPlain: string,
  textEncrypted: string
): Promise<boolean> => {
  return await bcrypt.compare(textPlain, textEncrypted);
};
