import classNames from 'classnames'
import React, { forwardRef, ReactNode } from 'react'

import { ChevronDownIcon } from './icons'

interface HoverableDropdownProps {
  className?: string
  title: ReactNode
  children: ReactNode
  isInContractEntry?: boolean
}

export const HoverableDropdown = forwardRef<
  HTMLDivElement,
  HoverableDropdownProps
>((props, ref) => {
  return (
    <div
      className={classNames(
        'HoverableDropdown group relative w-min whitespace-pre',
        props.className,
      )}
    >
      <HoverableDropdownToggle
        toggleRef={ref}
        isInContractEntry={props.isInContractEntry}
      >
        {props.title}
      </HoverableDropdownToggle>
      <HoverableDropdownMenu>{props.children}</HoverableDropdownMenu>
    </div>
  )
})

interface HoverableDropdownToggleProps {
  children: ReactNode
  toggleRef?: React.Ref<HTMLDivElement>
  isInContractEntry?: boolean
}

function HoverableDropdownToggle(props: HoverableDropdownToggleProps) {
  return (
    <div
      ref={props.toggleRef}
      className={classNames(
        'HoverableDropdownToggle flex cursor-pointer flex-row items-center gap-1.5 rounded-lg',
        'py-1.5 px-2 text-xs font-medium transition-colors',
        getToggleStyle(props.isInContractEntry),
      )}
    >
      {props.children}
      <ChevronDownIcon className="HoverableDropdownToggleIcon m-auto scale-75 transition-transform duration-300 group-hover:-rotate-180" />
    </div>
  )
}

interface HoverableDropdownMenuProps {
  className?: string
  children: ReactNode
}

function HoverableDropdownMenu(props: HoverableDropdownMenuProps) {
  return (
    <div className="HoverableDropdownMenu pointer-events-none absolute z-60 opacity-0 transition-opacity duration-300">
      <hr className="h-1.5 border-t-0" />
      <div
        className={classNames(
          'rounded-lg bg-gray-100 p-1 shadow-[0px_4px_20px_rgba(0,0,0,0.50)] dark:bg-neutral-700',
          props.className,
        )}
      >
        {props.children}
      </div>
    </div>
  )
}

function getToggleStyle(isInContractEntry?: boolean) {
  return isInContractEntry
    ? 'border border-pink-900 hover:bg-pink-900 hover:bg-opacity-25'
    : 'bg-gray-100 group-hover:bg-gray-200 dark:bg-neutral-700 dark:group-hover:bg-gray-750'
}
