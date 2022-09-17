import React from 'react'
import { Text } from '@chakra-ui/react'
import { truncate } from '../../../util/truncate'
import { walletState } from '../../../state/atoms/walletAtoms'
import { useRecoilValue } from 'recoil'
import { useConnectedWallet } from '@terra-money/wallet-provider'
function TruncatedAddress({connected}) {
  const {address} = useRecoilValue(walletState)
  const connectedWallet = useConnectedWallet()

  const truncatWalletAddress = (addr: string) => {
    const chainName = addr.substring(0, addr.indexOf("1") | 4)
    return connected ? `${chainName}${truncate(address, [0, 4])}` : `${chainName}${truncate(connectedWallet.walletAddress, [0, 4])}`
  }
  
  return (
    <Text color="brand.200" fontSize={['14px', '16px']}>
      {connected ? truncatWalletAddress(address)  : truncatWalletAddress(connectedWallet.walletAddress)}
    </Text>
  )
}

export default TruncatedAddress