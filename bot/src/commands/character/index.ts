import { createCommand } from '@hephaestus/eris'

import rm from './rm'
import add from './add'
import get from './get'
import list from './list'
import purge from './purge'

export default createCommand({
    type: 1,
    name: 'characters',
    description: 'List, add, or remove your characters!',
    options: [ add, list, get, rm, purge ],    
})