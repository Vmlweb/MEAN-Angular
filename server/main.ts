//Incudes
import { startup, shutdown } from 'server/app'

startup()

//Intercept kill and end signals
process.once('SIGTERM', shutdown as any)
process.once('SIGINT', shutdown as any)

export { shutdown }
