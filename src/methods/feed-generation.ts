import { InvalidRequestError } from '@atproto/xrpc-server'
import { Server } from '../lexicon'
import { AppContext } from '../config'
import algos from '../algos'
import { validateAuth } from '../auth'
import { AtUri } from '@atproto/syntax'

export default function (server: Server, ctx: AppContext) {
  server.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
    const feedUri = new AtUri(params.feed)
    const algo = algos[feedUri.rkey]
    if (!algo) {
      throw new InvalidRequestError(`Unknown algorithm: ${feedUri.rkey}`)
    }

    if (feedUri.hostname !== ctx.cfg.publisherDid) {
      throw new InvalidRequestError(
        'Unsupported algorithm: hostname != publisher did',
      )
    }

    if (feedUri.collection !== 'app.bsky.feed.generator') {
      throw new InvalidRequestError('UnsupportedAlgorithm')
    }

    /**
     * Example of how to check auth if giving user-specific results:
     *
     * const requesterDid = await validateAuth(
     *   req,
     *   ctx.cfg.serviceDid,
     *   ctx.didResolver,
     * )
     */

    const body = await algo(ctx, params)
    return {
      encoding: 'application/json',
      body: body,
    }
  })
}
