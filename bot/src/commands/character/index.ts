import { createCommand } from '@hephaestus/eris'

import add from './add'
import list from './list'

export default createCommand({
    type: 1,
    name: 'characters',
    description: 'List, add, or remove your characters!',
    options: [ add, list ],    
})