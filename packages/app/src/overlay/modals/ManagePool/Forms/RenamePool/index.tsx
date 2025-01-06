// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util'
import { PoolSetMetadata } from 'api/tx/poolSetMetadata'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { Binary } from 'polkadot-api'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'

export const RenamePool = ({
  setSection,
  section,
  onResize,
}: {
  setSection: Dispatch<SetStateAction<number>>
  section: number
  onResize: () => void
}) => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { setModalStatus } = useOverlay().modal
  const { activeAccount } = useActiveAccounts()
  const { isOwner, activePool } = useActivePool()
  const { getSignerWarnings } = useSignerWarnings()
  const { bondedPools, poolsMetaData } = useBondedPools()

  const poolId = activePool?.id

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  // Updated metadata value
  const [metadata, setMetadata] = useState<string>('')

  // Determine current pool metadata and set in state.
  useEffect(() => {
    const pool = bondedPools.find(
      ({ addresses }) => addresses.stash === activePool?.addresses.stash
    )
    if (pool) {
      setMetadata(u8aToString(u8aUnwrapBytes(poolsMetaData[Number(pool.id)])))
    }
  }, [section])

  useEffect(() => {
    setValid(isOwner())
  }, [isOwner()])

  const getTx = () => {
    if (!valid || !poolId) {
      return null
    }
    return new PoolSetMetadata(network, poolId, Binary.fromText(metadata)).tx()
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const handleMetadataChange = (e: FormEvent<HTMLInputElement>) => {
    setMetadata(e.currentTarget.value)
    setValid(true)
  }

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  )

  return (
    <>
      <Padding horizontalOnly>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        <input
          className="underline"
          style={{ width: '100%' }}
          placeholder={t('poolName')}
          type="text"
          onChange={(e: FormEvent<HTMLInputElement>) => handleMetadataChange(e)}
          value={metadata ?? ''}
        />
        <p>{t('storedOnChain')}</p>
      </Padding>
      <SubmitTx
        valid={valid}
        buttons={[
          <ButtonSubmitInvert
            key="button_back"
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-1"
            onClick={() => setSection(0)}
          />,
        ]}
        onResize={onResize}
        {...submitExtrinsic}
      />
    </>
  )
}
