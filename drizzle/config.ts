import path from 'node:path'
import type { Config } from 'drizzle-kit'

const dir = __dirname

const config: Config = {
  out: 'drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${path.join(dir, '../data/feed.db')}`,
  },
}

export default config
