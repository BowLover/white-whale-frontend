import React from 'react'
import { HStack, Button, useToast } from '@chakra-ui/react'
import ConnectedWalletIcon from './ConnectedWalletIcon'
import TruncatedAddress from './TruncatedAddress'
import { useRecoilValue } from 'recoil'
import { walletState } from '../../../state/atoms/walletAtoms'
function ConnectedWallet({connected}) {
    const toast = useToast()
    const {address} = useRecoilValue(walletState)

    const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(address)
      toast({
        title: 'Address copied to clipboard',
        status: 'success',
        duration: 1000,
        position: "top-right",
        isClosable: true
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <HStack padding="0" as={Button} variant="unstyled" onClick={copyToClipboard} width="full">
      <ConnectedWalletIcon connected={connected} />
      <TruncatedAddress connected={connected} />
    </HStack>
  )
}

export default ConnectedWallet