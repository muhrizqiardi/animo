import { envsafe, str } from 'envsafe';

export const env = envsafe({
  BACKEND_API_URL: str({
    devDefault: 'http://localhost:9000',
  }),
});
