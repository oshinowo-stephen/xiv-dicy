import needle from 'needle'

interface LoadstoneCharacter {
    Bio: string
}

export const verifyCharacter = (key: string, charURI: string): Promise<void> => {
    const charURL = new URL(charURI)
    const charID = charURL.pathname.split('/')[3]

    return new Promise((resolve, reject) => {
        needle.get(`https://xivapi.com/character/${charID}`, (error,  response) => {
            if (error) {
                reject(error)
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Unable to pefrom request: ${response.statusMessage} | ${response.statusCode}`))
            }

            const { Bio: bio } = response.body.Character as LoadstoneCharacter 

            if (bio.includes(key)) {
                resolve()
            } else {
                reject(new Error('Invalid Key.'))
            }
        })
    })
}