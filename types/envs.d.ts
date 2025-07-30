import * as zod from 'zod';

const envVariables = zod.object({
  NODE_ENV: zod.enum(['dev', 'prod', 'test']).default('dev'),
});
envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
