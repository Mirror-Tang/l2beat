import { ArbiscanClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { TotalSupplyFormulaUpdater } from '../../core/assets/TotalSupplyFormulaUpdater'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { ArbitrumBalanceProvider } from '../../core/balances/providers/ArbitrumBalanceProvider'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { ArbitrumTotalSupplyProvider } from '../../core/totalSupply/providers/ArbitrumTotalSupplyProvider'
import { TotalSupplyUpdater } from '../../core/totalSupply/TotalSupplyUpdater'
import { ArbitrumMulticallClient } from '../../peripherals/arbitrum/multicall/ArbitrumMulticall'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createArbitrumTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  if (!config.tvl.arbitrum) {
    logger.info('Arbitrum TVL module disabled')
    return
  }

  // #region peripherals
  const arbitrumProvider = new providers.JsonRpcProvider(
    config.tvl.arbitrum.providerUrl,
    'arbitrum',
  )

  const arbiscanClient = new ArbiscanClient(
    http,
    config.tvl.arbitrum.arbiscanApiKey,
    config.tvl.arbitrum.minBlockTimestamp,
    logger,
  )

  const arbitrumClient = new EthereumClient(arbitrumProvider, logger, 25)

  const arbitrumMulticall = ArbitrumMulticallClient.forMainnet(arbitrumClient)

  const totalSupplyProvider = new ArbitrumTotalSupplyProvider(
    arbitrumClient,
    arbitrumMulticall,
  )

  const arbitrumBalanceProvider = new ArbitrumBalanceProvider(
    arbitrumClient,
    arbitrumMulticall,
  )

  // #endregion
  // #region updaters

  const arbiscanBlockNumberUpdater = new BlockNumberUpdater(
    arbiscanClient,
    db.blockNumberRepository,
    clock,
    logger,
    ChainId.ARBITRUM,
    config.tvl.arbitrum.minBlockTimestamp,
  )

  const arbitrumBalanceUpdater = new BalanceUpdater(
    arbitrumBalanceProvider,
    arbiscanBlockNumberUpdater,
    db.balanceRepository,
    db.balanceStatusRepository,
    clock,
    [],
    logger,
    ChainId.ARBITRUM,
    config.tvl.arbitrum.minBlockTimestamp,
  )

  const totalSupplyTokens = config.tokens.filter(
    (t) => t.chainId === ChainId.ARBITRUM && t.formula === 'totalSupply',
  )
  const totalSupplyUpdater = new TotalSupplyUpdater(
    totalSupplyProvider,
    arbiscanBlockNumberUpdater,
    db.totalSupplyRepository,
    db.totalSupplyStatusRepository,
    clock,
    totalSupplyTokens,
    logger,
    ChainId.ARBITRUM,
    config.tvl.arbitrum.minBlockTimestamp,
  )

  const totalSupplyFormulaUpdater = new TotalSupplyFormulaUpdater(
    priceUpdater,
    totalSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    ProjectId.ARBITRUM,
    ChainId.ARBITRUM,
    clock,
    totalSupplyTokens,
    logger,
    config.tvl.arbitrum.minBlockTimestamp,
  )
  // #endregion

  const start = async () => {
    logger = logger.for('ArbitrumTvlModule')
    logger.info('Starting')

    await arbiscanBlockNumberUpdater.start()
    await arbitrumBalanceUpdater.start()
    await totalSupplyUpdater.start()
    await totalSupplyFormulaUpdater.start()

    logger.info('Started')
  }

  return {
    updaters: [totalSupplyFormulaUpdater],
    start,
  }
}
