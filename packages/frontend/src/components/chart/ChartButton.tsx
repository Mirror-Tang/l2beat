import { AssetType } from '@l2beat/shared-pure'
import cx from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  checked?: boolean
  name: string
  value: string
  tvlEndpoint?: string
  assetType?: AssetType
  children?: ReactNode
  className?: string
}

/** @deprecated */
export function ChartButton(props: Props) {
  return (
    <label
      className={cx(
        'relative block cursor-pointer select-none',
        props.className,
      )}
    >
      <input
        className="peer absolute top-0 left-0 block h-full w-full cursor-pointer opacity-0"
        defaultChecked={props.checked}
        type="radio"
        name={props.name}
        value={props.value}
        data-tvl-endpoint={props.tvlEndpoint}
        data-asset-type={props.assetType}
        autoComplete="off"
      />
      <span className="relative block pb-1 outline-current after:absolute after:left-0 after:bottom-0.5 after:h-0.5 after:w-full peer-checked:font-bold peer-checked:after:bg-current peer-focus-visible:outline-dotted peer-focus-visible:outline-1">
        {props.children ?? props.value}
      </span>
    </label>
  )
}
