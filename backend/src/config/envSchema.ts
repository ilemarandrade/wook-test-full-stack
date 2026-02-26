/**
 * Schema de variables de entorno vitales.
 * Valida al inicio y muestra errores controlados en consola si falta alguna.
 */

type EnvVarRule = {
  required: boolean;
  message: string;
  validate?: (value: string) => boolean;
};

export type EnvVarKey = keyof typeof ENV_SCHEMA;

export const ENV_SCHEMA: Record<string, EnvVarRule> = {
  JWT_SECRET: {
    required: true,
    message: 'JWT_SECRET is required for signing and verifying tokens',
    validate: (v: string) => v.trim().length > 0,
  },
  DATABASE_URL: {
    required: true,
    message: 'DATABASE_URL is required (e.g. postgresql://user:pass@host:5432/db)',
    validate: (v: string) =>
      v.trim().length > 0 &&
      (v.startsWith('postgresql://') || v.startsWith('postgres://')),
  },
} as const;

export interface EnvValidationError {
  key: string;
  message: string;
  value?: string;
}

function getEnvValue(key: string): string | undefined {
  const v = process.env[key];
  return typeof v === 'string' ? v : undefined;
}

export function validateEnvSchema(): EnvValidationError[] {
  const errors: EnvValidationError[] = [];

  for (const [key, rule] of Object.entries(ENV_SCHEMA)) {
    const value = getEnvValue(key);

    if (rule.required) {
      if (value === undefined || value === '') {
        errors.push({ key, message: rule.message });
        continue;
      }
      if (rule.validate && !rule.validate(value)) {
        errors.push({
          key,
          message: rule.message,
          value: value ? '[REDACTED]' : undefined,
        });
        continue;
      }
    }
  }

  return errors;
}

function formatValidationErrors(errors: EnvValidationError[]): string {
  const title = '\n[ENV VALIDATION FAILED] Missing or invalid required environment variables.\n';
  const lines = errors.map((e) => `  • ${e.key}: ${e.message}`);
  const hint = '\nSet them in .env or in your environment. See .env.example for reference.\n';
  return title + lines.join('\n') + hint;
}

/**
 * Valida todas las variables vitales del schema (ENV_SCHEMA).
 * Si hay errores, los muestra en consola de forma controlada y termina el proceso.
 */
export function validateEnv(): void {
  const errors = validateEnvSchema();

  if (errors.length === 0) {
    return;
  }

  console.error(formatValidationErrors(errors));
  process.exit(1);
}
