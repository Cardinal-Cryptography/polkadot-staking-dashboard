// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { AnyJson } from '@w3ux/types'
import CrossSVG from 'assets/svg/icons/cross.svg?react'
import { useHelp } from 'contexts/Help'
import type { FunctionComponent, SVGProps } from 'react'
import type { CSSProperties } from 'styled-components'
import { ButtonHelp } from 'ui-buttons'
import { ModalTitle } from 'ui-core/overlay'
import { useOverlay } from 'ui-overlay'
import { TitleWrapper } from './Wrappers'

interface TitleProps {
  title?: string
  icon?: IconProp
  Svg?: FunctionComponent<SVGProps<AnyJson>>
  fixed?: boolean
  helpKey?: string
  style?: CSSProperties
}

export const Title = ({
  helpKey,
  title,
  icon,
  fixed,
  Svg,
  style,
}: TitleProps) => {
  const { openHelp } = useHelp()
  const { setModalStatus } = useOverlay().modal

  const graphic = Svg ? (
    <Svg style={{ width: '1.5rem', height: '1.5rem' }} />
  ) : icon ? (
    <FontAwesomeIcon transform="grow-3" icon={icon} />
  ) : null

  return (
    <TitleWrapper $fixed={fixed || false} style={{ ...style }}>
      <div>
        {graphic}
        {title && (
          <ModalTitle>
            {title}
            {helpKey ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </ModalTitle>
        )}
      </div>
      <div>
        <button type="button" onClick={() => setModalStatus('closing')}>
          <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </TitleWrapper>
  )
}
