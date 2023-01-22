import { createCommand } from '@hephaestus/eris'

import list from './list'

export default createCommand({
    type: 1,
    name: 'character',
    description: 'List or modify your characters!',
    options: [ list ]
})