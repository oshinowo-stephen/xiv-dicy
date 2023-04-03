import { join as __join, resolve } from 'path'

process.env['NODE_CONFIG_DIR'] = process.env.NODE_ENV !== 'prod' 
    ? resolve(process.cwd(), '../config')
    : resolve(process.cwd(), './config')