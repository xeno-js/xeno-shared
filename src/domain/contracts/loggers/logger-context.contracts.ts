import type { Maybe, Optional } from '@/shared'

import type { MessagingContext } from '../context'

/**
 * @description LoggerContext defines the structure for logging-related information used in logging and monitoring. It includes identity, network, and tracing information, as well as optional messaging context for distributed tracing.
 */
export interface LoggerContext {
  identity: {
    userId: Optional<string>
    tenantId: Optional<string>
  }
  network: {
    requestId: Optional<string>
    path: Optional<string>
    origin: Optional<string>
    clientIp: Optional<string> // Valuta se mascherarlo in base alle policy aziendali
  }
  tracing: {
    correlationId: Optional<string>
    spanId: Optional<string>
    startTime: Optional<number>
    parentSpanId: Optional<string>
  }
  messaging?: Maybe<MessagingContext>
}
