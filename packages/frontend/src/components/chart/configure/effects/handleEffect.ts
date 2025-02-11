import { ZodSchema } from 'zod'

import { Message } from '../messages'
import {
  ActivityResponse,
  AggregateDetailedTvlResponse,
  AggregateTvlResponse,
  TokenTvlResponse,
} from '../state/State'
import {
  Effect,
  FetchActivityEffect,
  FetchAggregateTvlEffect,
  FetchAlternativeTvlEffect,
  FetchDetailedAggregateTvlEffect,
  FetchTokenTvlEffect,
} from './effects'

export function handleEffect(
  effect: Effect,
  dispatch: (message: Message) => void,
) {
  switch (effect.type) {
    case 'FetchAggregateTvl':
      return handleFetchAggregateTvl(effect, dispatch)
    case 'FetchDetailedAggregateTvl':
      return handleFetchDetailedAggregateTvl(effect, dispatch)
    case 'FetchAlternativeTvl':
      return handleFetchAlternativeTvl(effect, dispatch)
    case 'FetchTokenTvl':
      return handleFetchTokenTvl(effect, dispatch)
    case 'FetchActivity':
      return handleFetchActivity(effect, dispatch)
  }
}

function handleFetchAggregateTvl(
  { url, requestId }: FetchAggregateTvlEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'AggregateTvlLoaded', requestId, data }),
    () => ({ type: 'AggregateTvlFailed', requestId }),
    AggregateTvlResponse,
  )
}

function handleFetchDetailedAggregateTvl(
  { url, requestId }: FetchDetailedAggregateTvlEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'AggregateDetailedTvlLoaded', requestId, data }),
    () => ({ type: 'AggregateDetailedTvlFailed', requestId }),
    AggregateDetailedTvlResponse,
  )
}

function handleFetchAlternativeTvl(
  { url, requestId }: FetchAlternativeTvlEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'AlternativeTvlLoaded', requestId, data }),
    () => ({ type: 'AlternativeTvlFailed', requestId }),
    AggregateTvlResponse,
  )
}

function handleFetchTokenTvl(
  { url, requestId, token, assetType }: FetchTokenTvlEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'TokenTvlLoaded', requestId, token, assetType, data }),
    () => ({ type: 'TokenTvlFailed', requestId }),
    TokenTvlResponse,
  )
}

function handleFetchActivity(
  { url, requestId }: FetchActivityEffect,
  dispatch: (message: Message) => void,
) {
  timeoutLoader(requestId, dispatch)
  fetchThenDispatch(
    url,
    dispatch,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (data) => ({ type: 'ActivityLoaded', requestId, data }),
    () => ({ type: 'ActivityFailed', requestId }),
    ActivityResponse,
  )
}

function fetchThenDispatch(
  url: string,
  dispatch: (message: Message) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  successMessage: (data: any) => Message,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage: (error: any) => Message,
  schema: ZodSchema<
    | AggregateTvlResponse
    | TokenTvlResponse
    | ActivityResponse
    | AggregateDetailedTvlResponse
  >,
) {
  fetch(url)
    .then((res) => res.json())
    .then((json) => schema.parse(json))
    .then(
      (data) => dispatch(successMessage(data)),
      (error) => {
        console.error(error)
        dispatch(errorMessage(error))
      },
    )
}

function timeoutLoader(
  requestId: number,
  dispatch: (message: Message) => void,
) {
  setTimeout(() => dispatch({ type: 'LoaderTimedOut', requestId }), 300)
}
