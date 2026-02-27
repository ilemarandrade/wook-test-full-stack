import { Prisma, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import prisma from '../../prisma/client';
import { encrypt } from '../../utils/encryptPassword';

const DEFAULT_USER_LANG = 'es';

const TEST_USER_PASSWORD = '12345678';

const buildRandomUsers = (count: number) => {
  const users = [];

  for (let i = 1; i <= count; i += 1) {
    const name = faker.person.firstName();
    const lastname = faker.person.lastName();
    const email = faker.internet
      .email({
        firstName: name,
        lastName: lastname,
      })
      .toLowerCase();
    const document = faker.string.numeric(8);
    const phone = `1${faker.string.numeric(8)}`;

    users.push({
      name,
      lastname,
      email,
      document,
      phone,
      lang: DEFAULT_USER_LANG,
    });
  }

  return users;
};

export const runInitialUsersSeed = async (): Promise<void> => {
  const adminNameFromEnv = process.env.ADMIN_NAME;
  const adminLastnameFromEnv = process.env.ADMIN_LASTNAME;
  const adminPasswordFromEnv = process.env.ADMIN_PASSWORD;
  const adminEmailFromEnv = process.env.ADMIN_EMAIL;
  const adminDocumentFromEnv = process.env.ADMIN_DOCUMENT;
  const adminPhoneFromEnv = process.env.ADMIN_PHONE;
  const adminLangFromEnv = process.env.ADMIN_LANG;

  if (
    !adminPasswordFromEnv ||
    !adminEmailFromEnv ||
    !adminDocumentFromEnv ||
    !adminPhoneFromEnv ||
    !adminLangFromEnv ||
    !adminNameFromEnv ||
    !adminLastnameFromEnv
  ) {
    throw new Error(
      'ADMIN_PASSWORD, ADMIN_EMAIL, ADMIN_DOCUMENT, ADMIN_PHONE, ADMIN_NAME, ADMIN_LASTNAME and ADMIN_LANG environment variables are required to create initial admin user'
    );
  }

  try {

    const usersCount = await prisma.user.count();

    if (usersCount === 0) {
      const encryptedUserPassword = await encrypt(TEST_USER_PASSWORD);
      const randomUsers = buildRandomUsers(30).map((user) => ({
        ...user,
        password: encryptedUserPassword,
        role: Role.USER,
      }));

      await prisma.user.createMany({
        data: randomUsers,
      });
    }

    const existingAdmin = await prisma.user.findFirst({
      where: { email: adminEmailFromEnv },
    });

    if (!existingAdmin) {
      const encryptedAdminPassword = await encrypt(adminPasswordFromEnv);

      const adminData = {
        name: adminNameFromEnv,
        lastname: adminLastnameFromEnv,
        email: adminEmailFromEnv,
        password: encryptedAdminPassword,
        document: adminDocumentFromEnv,
        phone: adminPhoneFromEnv,
        lang: adminLangFromEnv,
        role: Role.ADMIN,
      };

      await prisma.user.create({
        data: adminData,
      });
    }

 
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2021'
    ) {
      throw new Error(
        'Database schema is not initialized. Run the Prisma migrations (for example, `npm run prisma:migrate`) before starting the API.'
      );
    }

    throw error;
  }
};


