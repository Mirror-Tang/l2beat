import { VerificationStatus } from '@l2beat/shared-pure'
import cx from 'classnames'
import React from 'react'

import { HoverableDropdown } from '../HoverableDropdown'
import { BulletIcon } from '../icons/symbols/BulletIcon'
import { Link } from '../Link'
import { UnverifiedContractsWarning } from '../table/UnverifiedContractsWarning'
import { Callout } from './Callout'
import { EtherscanLink } from './EtherscanLink'
import { ReferenceList, TechnologyReference } from './ReferenceList'
import { ClipboardIcon } from '../icons/symbols/ClipboardIcon'

export interface TechnologyContract {
  name: string
  addresses?: string[]
  additionalAddresses?: {
    dropdownTitle: string
    addresses: string[]
  }
  description?: string
  links: TechnologyContractLinks[]
  upgradeableBy?: string
  upgradeDelay?: string
  upgradeConsiderations?: string
  references?: TechnologyReference[]
}

export interface TechnologyContractLinks {
  name: string
  href: string
  address: string
  isAdmin: boolean
}
export interface ContractEntryProps {
  contract: TechnologyContract

  verificationStatus: VerificationStatus
  className?: string
}

export function ContractEntry({
  contract,
  verificationStatus,
  className,
}: ContractEntryProps) {
  const areLinksUnverified = contract.links
    .filter((c) => !c.isAdmin)
    .map((c) => verificationStatus.contracts[c.address])
    .some((c) => c === false)

  const areAddressesUnverified = (contract.addresses ?? [])
    .map((c) => verificationStatus.contracts[c])
    .some((c) => c === false)

  const color = areAddressesUnverified || areLinksUnverified ? 'red' : undefined
  const icon =
    areAddressesUnverified || areLinksUnverified ? (
      <UnverifiedContractsWarning
        className="mt-[3px]"
        tooltip="Source code is not verified"
      />
    ) : (
      <BulletIcon className="h-6 md:h-[27px]" />
    )

  return (
    <Callout
      className={cx(color === 'red' ? 'p-4' : 'px-4', className)}
      color={color}
      icon={icon}
      body={
        <>
          <div className="flex flex-wrap gap-x-2">
            <strong>{contract.name}</strong>{' '}
            {(contract.addresses ?? []).map((address, i) => (
              <EtherscanLink
                address={address}
                key={i}
                className={cx(
                  verificationStatus.contracts[address] === false
                    ? 'text-red-300'
                    : '',
                )}
              />
            ))}
            {contract.links.map((x, i) => (
              <Link
                key={i}
                className={cx(
                  verificationStatus.contracts[x.address] === false &&
                    !x.isAdmin
                    ? 'text-red-300'
                    : '',
                )}
                href={x.href}
              >
                {x.name}
              </Link>
            ))}
            {contract.additionalAddresses && (
              <HoverableDropdown
                isInContractEntry={true}
                className="mt-[-8px]"
                title={
                  contract.additionalAddresses.dropdownTitle +
                  ` (${contract.additionalAddresses.addresses.length})`
                }
                children={
                  <div className="ml-3 mt-2 flex flex-col">
                    {contract.addresses && contract.addresses.length > 0 && (
                      <>
                        <div className="text-sm font-semibold">
                          {contract.name}
                          {':'}
                        </div>
                        <div className="flex rounded-lg py-2  text-xs ">
                          <EtherscanLink
                            address={contract.addresses[0]}
                            fullAddress={true}
                            className={cx(
                              verificationStatus.contracts[
                                contract.addresses[0]
                              ] === false
                                ? 'text-red-300'
                                : '',
                            )}
                          />
                          <ClipboardIcon className="ml-2 mt-[2px] fill-gray-800 dark:fill-white" />
                        </div>
                      </>
                    )}
                    <div className="py-1 text-sm font-semibold">
                      {contract.additionalAddresses.dropdownTitle}:
                    </div>
                    {contract.additionalAddresses.addresses.map(
                      (address, i) => (
                        <div key={i} className=" flex rounded-lg py-2 text-xs ">
                          <div className="ml-1 w-8 text-left  opacity-50">
                            {i + 1}.
                          </div>
                          <EtherscanLink
                            address={address}
                            key={i}
                            fullAddress={true}
                            className={cx(
                              verificationStatus.contracts[address] === false
                                ? 'text-red-300'
                                : '',
                              'mt-[1px]',
                            )}
                          />
                        </div>
                      ),
                    )}
                  </div>
                }
              />
            )}
          </div>
          {contract.description && (
            <p className="mt-2 text-gray-850 dark:text-gray-400">
              {contract.description}
            </p>
          )}
          {contract.upgradeableBy && (
            <p className="mt-2 text-gray-850 dark:text-gray-400">
              <strong className="text-black dark:text-white">
                Can be upgraded by:
              </strong>{' '}
              {contract.upgradeableBy}
            </p>
          )}
          {contract.upgradeDelay && (
            <p className="mt-2 text-gray-850 dark:text-gray-400">
              <strong className="text-black dark:text-white">
                Upgrade delay:
              </strong>{' '}
              {contract.upgradeDelay}
            </p>
          )}
          {contract.upgradeConsiderations && (
            <>
              <button
                className="text-link mt-2 text-sm underline"
                data-component="upgrade-description-button"
              >
                Show upgrade details
              </button>
              {/* TODO: remove leading once line heights are fixed for all text on the page */}
              <p className="mt-2 hidden text-sm leading-[15px] text-gray-850 dark:text-gray-400">
                {contract.upgradeConsiderations}
              </p>
            </>
          )}
          {contract.references && (
            <ReferenceList references={contract.references} tight />
          )}
        </>
      }
    />
  )
}
