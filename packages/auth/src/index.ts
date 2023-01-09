import http from 'needle'

const {
  FF_LOGS_CLIENT_ID,
  FF_LOGS_CLIENT_SEC,
} = process.env

class RequestError extends Error {
  public readonly reason: string
  public readonly error: string

  constructor(message: string, reason: string) {
    super(message)

    this.name = this.constructor.name
    this.error = message
    this.reason = reason

    Error.captureStackTrace(this, this.constructor)
  }
}

export const loadTokenToEnv = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    http.post('https://www.fflogs.com/oauth/token',
      `grant_type=client_credentials&client_id=${FF_LOGS_CLIENT_ID}&client_secret=${FF_LOGS_CLIENT_SEC}`,
      (error, response) => {
        if (error) {
          reject(new RequestError(error.message, error.name))
        }

        if (response.statusCode !== 200) {
          reject(new RequestError('Error on request', response.statusMessage))
        }

        resolve(process.env['FF_LOGS_TOKEN'] = response.body.access_token)
      }
    )
  })
}
