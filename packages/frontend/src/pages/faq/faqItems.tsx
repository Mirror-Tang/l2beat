import React, { ReactNode } from 'react'

import { Link } from '../../components/Link'

export interface FaqItem {
  question: string
  answer: React.ReactNode
}

export const faqItems: FaqItem[] = [
  {
    question: 'What is the overall purpose of this site?',
    answer: (
      <span>
        L2BEAT was created to provide transparent and verifiable insights into
        emerging layer two (L2) technologies which, in line with the{' '}
        <Link href="https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698">
          rollup-centric Ethereum scaling roadmap
        </Link>{' '}
        are aimed at scaling Ethereum.
      </span>
    ),
  },
  {
    question: 'Why do you need L2BEAT if you have DeFi Pulse, DefiLlama, etc.?',
    answer:
      'While the above-mentioned sites are great, they focus primarily at tracking Value Locked in DeFi projects on various chain. In comparison L2BEAT will track only L2 projects (at first on Ethereum only) and will eventually report not just Value Locked but various metrics related to the liveness and security of these projects.',
  },
  {
    question:
      'Why does the Value Locked on L2BEAT differ from the one on DefiLlama?',
    answer: (
      <div>
        <p className="mt-4">
          L2BEAT and DefiLlama use different methodologies for calculating Value
          Locked. L2BEAT accounts for all assets locked in Ethereum contracts,
          including L2-native governance tokens (ARB, OP), while DefiLlama
          focuses on assets actively engaged in dApps on specific networks.
        </p>
        <p className="mt-4">
          Let's assume L2BEAT reports a Value Locked of 2.5 billion, while
          DefiLlama reports a Value Locked of 1 billion for the same Layer 2
          network (e.g., Arbitrum). This suggests that 1.5 billion worth of
          assets have been bridged to Arbitrum from Layer 1 (Ethereum), but are
          not yet being used in any dApps listed by DefiLlama. For instance, if
          you deposit 1 ETH to Optimism, L2BEAT would include it in their Value
          Locked calculation, but DefiLlama would not. However, if you use that
          1 ETH on Optimism to provide liquidity on Uniswap, DefiLlama would
          then include it in their Value Locked calculation. Also, at L2BEAT,
          the value of L2-native governance tokens is included, which adds to
          the discrepancy.
        </p>
        <p className="mt-4">
          The discrepancy in reported Value Locked between L2BEAT and DefiLlama
          is due to different interpretations of "Value Locked." L2BEAT
          considers the entire Ethereum ecosystem, while DefiLlama emphasizes
          assets used in dApps on individual blockchain networks.
        </p>
      </div>
    ),
  },
  {
    question: 'What exactly are L2s and why Polygon is not included?',
    answer: (
      <span>
        L2s are chains that can be exited by interacting directly with L1 alone,
        eliminating the need to rely on L2 operators for the security of the
        funds. In the case of Polygon, an additional layer of trust is
        introduced: users must trust the majority of Polygon's validators to
        enable secure withdrawals and prevent fund theft. Note that
        application-specific logic, like in the case of dYdX forced trade
        requests, may also require inter-user dependencies to successfully exit
        the system.
      </span>
    ),
  },
  {
    question: 'Right, so how can L1 help with the security of L2?',
    answer: (
      <div>
        <p className="mt-4">
          There are two primary (and somewhat independent) mechanisms that L2
          chains can use.
        </p>
        <p className="mt-4">
          First, the L2 state can be verified by L1 through either{' '}
          <Strong>Validity Proofs</Strong> or <Strong>Fraud Proofs</Strong>.
          This mechanism is most important as it ensures that L2 proposers
          cannot cheat and include invalid transactions in an L2 block, e.g.
          mint coins out of thin air or steal your coins.
        </p>
        <p className="mt-4">
          The second use of L1 is as a <Strong>Data Availability</Strong> layer
          for L2 transactions so that users can independently re-create the L2
          state and ensure continued and safe system operation or trustlessly
          exit to L1.
        </p>
      </div>
    ),
  },
  {
    question: 'Can you explain how L1 can help with L2 state validation?',
    answer: (
      <div>
        <p className="mt-4">
          An L2 chain can periodically "commit" its state to L1 by submitting
          the hash of its current state root. A state root is just a number,
          e.g: <code>0x77905a71f4b32221...</code> . We need a mechanism to
          ensure that this number corresponds to the actual L2 state.
        </p>
        <p className="mt-4">
          One way to do so is by providing a cryptographic{' '}
          <Strong>Validity Proof</Strong> (zkProof) that will be verified by the
          L1 smart contract. If the verification passes, users can be sure that
          the state root represents the results of valid transaction execution.
        </p>
        <p className="mt-4">
          Alternatively, an honest L2 chain observer can challenge roots. They
          can do this by producing a <Strong>Fraud Proof</Strong>. This proof
          empowers the L1 contract to autonomously confirm the inaccuracy of the
          state root and subsequently reject it.
        </p>
      </div>
    ),
  },
  {
    question: 'What if an L2 proposer submit a fraudulent state commit to L1?',
    answer: (
      <>
        A state root from L2 is typically used to check coin ownership on L2
        that user wants to withdraw to L1. If the fraudulent state root is
        submitted, it may attest that all coins belong to a dishonest L2
        validator rather than legitimate users. These coins can be then
        withdrawn to L1 from L2&mdash;effectively stealing them. This is why it
        is not enough to simply commit state roots of L2 to L1, we need to be
        sure that this state root is valid.
      </>
    ),
  },
  {
    question: "Are there any other ways L2 validators can steal user's coins?",
    answer:
      'Most L2 constructions are upgradable and until upgradability mechanism is either fully disabled or controlled by a sufficiently decentralised DAO, the funds can be, in theory, stolen through the upgrade mechanism. L2BEAT will closely monitor how the particular construction is upgradable and who currently controls the upgradability keys.',
  },
  {
    question: 'What about data availability? Why is it important?',
    answer: (
      <div>
        <p className="mt-4">
          To trustlessly withdraw coins from L2, users need to prove ownership
          of the coins to L1 smart contract that holds all the funds. For that
          they need to have access to all L2's transactions or its current
          state. To not introduce any additional trust assumptions, L2
          transactions can simply be recorded on L1 (as cheap calldata).
        </p>
        <p className="mt-4">
          For more details on data availability and its importance in security
          of scaling protocols, see Ethereum.org's{' '}
          <Link href="https://ethereum.org/en/developers/docs/data-availability/">
            page on the topic
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    question: 'Ok, so what are the main categories of L2s?',
    answer: (
      <div>
        <p className="mt-4">
          The systems that can be exited just by interacting with L1 are:
          <UnorderedList>
            <li>
              <Strong>zkRollups</Strong> - they publish data on L1 (Ethereum) to
              inherit data availability and consensus guarantees, and use
              validity proofs to guarantee state roots correctness.
            </li>
            <li>
              <Strong>Optimistic Rollups</Strong> - they publish data on L1 to
              inherit data availability and consensus guarantees, and use fraud
              proofs to guarantee state roots correctness.
            </li>
            <li>
              <Strong>State channels</Strong> - they don’t publish data onchain,
              but require users to keep their data in order to exit. They’re not
              general and require users participation.
            </li>
            <li>
              <Strong>Plasma</Strong> - they don’t publish data onchain and use
              fraud proofs for disputes. Similarly to state channels, users are
              required to keep their data to correctly exit. They don’t require
              users participation, but they do not support general computation.
            </li>
          </UnorderedList>
        </p>
        <p className="mt-4">
          For more details see the{' '}
          <Link href="https://vitalik.ca/general/2021/01/05/rollup.html">
            Incomplete guide to Rollups
          </Link>
          by Vitalik Buterin.
        </p>
      </div>
    ),
  },
  {
    question: 'How exactly do you calculate metrics like Value Locked?',
    answer: (
      <div>
        <p className="mt-4">
          It varies from project to project but we generally track the amount of
          tokens locked in all token escrow contracts for a given L2. Sometimes
          it's a single token escrow like for zkSync but sometimes these are
          multiple token escrows for a single L2 (Optimism).
        </p>
        <p className="mt-4">
          For more details see our{' '}
          <Link href="https://github.com/l2beat/l2beat/tree/master/packages/config/src">
            project definitions
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    question: 'Apart from Value Locked, what is L2BEAT aiming to track?',
    answer:
      "We will continuously monitor different L2 technologies with the primary focus on user funds' security. To this end we will track not just the usage of a particular L2 (Value Locked, frequency of state root commits, number of transactions, gas cost, etc...) but we will try highlight main risks related to their implementation that may affect user's funds security.",
  },
  {
    question: 'Is L2BEAT performing a security audit for each L2?',
    answer: (
      <span>
        No, the L2BEAT team <Strong>DOES NOT DO SECURITY AUDITS</Strong>. All
        the information that we present on our site should be independently
        verified by anyone wanting to use given L2. Our goal is to collect as
        much information as we can about the "state of L2s" and allow the
        community to better understand what security assumptions are used to
        build given L2 solutions.
      </span>
    ),
  },
  {
    question:
      "Why aren't state channel based solutions like Raiden or Nahmii included?",
    answer: (
      <div>
        <p className="mt-4">
          We are currently focused mainly on rollups, but would love to expand
          our research to state channels in the future. For the time being we
          lack resources to properly evaluate those systems.
        </p>
        <p className="mt-4">
          Nahmii was actually listed on L2BEAT for a time, but was removed for
          the reason stated above. If you want to check Value Locked for Nahmii
          you can do that{' '}
          <Link href="https://etherscan.io/address/0xCc8D82f6ba952966E63001c7B320EEF2Ae729099">
            on etherscan
          </Link>
          .
        </p>
      </div>
    ),
  },
  {
    question: 'How can I add a new project or improve some info?',
    answer: (
      <div>
        <p className="mt-4">
          Everything is{' '}
          <Link href="https://github.com/l2beat/l2beat">open source</Link>{' '}
          &ndash; just create a PR. If you want to add a new project you should
          read our {''}
          <Link href="https://github.com/l2beat/l2beat/tree/master/CONTRIBUTING.md">
            contributing guidelines
          </Link>
          .
        </p>
        <p className="mt-4">
          🔍 Here is also a visual step-by-step guide for creating a Pull
          Request -{' '}
          <Link href="https://www.notion.so/l2beat/How-to-add-milestones-0e8684a83c3c48ce8bc7b605d9c9a1bf">
            link
          </Link>
        </p>
      </div>
    ),
  },
]

function Strong({ children }: { children: ReactNode }) {
  return (
    <span className="font-bold text-yellow-700 dark:text-yellow-300">
      {children}
    </span>
  )
}

function UnorderedList({ children }: { children: ReactNode }) {
  return <ul className="list-inside list-disc pl-4">{children}</ul>
}
