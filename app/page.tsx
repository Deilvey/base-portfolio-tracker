'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { createPublicClient, http, formatEther, parseAbi } from 'viem'
import { base } from 'viem/chains'

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006'

const ERC20_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
])

export default function Home() {
  const [context, setContext] = useState<any>(null)
  const [address, setAddress] = useState<string>('')
  const [balances, setBalances] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const ctx = await sdk.context
        setContext(ctx)
        
        // Try to get wallet from SDK
        const wallet = await sdk.wallet.ethProvider?.request({
          method: 'eth_requestAccounts'
        }).catch(() => null)
        
        if (wallet && wallet[0]) {
          setAddress(wallet[0])
          await fetchBalances(wallet[0])
        } else if (ctx?.user?.fid) {
          // Fallback: use demo address for testing
          const demoAddress = '0x0000000000000000000000000000000000000000'
          setAddress(demoAddress)
          await fetchBalances(demoAddress)
        }
        
        // Signal ready
        await sdk.actions.ready()
      } catch (error) {
        console.error('Init error:', error)
        await sdk.actions.ready()
      } finally {
        setLoading(false)
      }
    }
    
    init()
  }, [])

  const fetchBalances = async (addr: string) => {
    try {
      const client = createPublicClient({
        chain: base,
        transport: http('https://mainnet.base.org')
      })

      const checksumAddr = addr as `0x${string}`

      // Get ETH balance
      const ethBalance = await client.getBalance({ address: checksumAddr })
      
      // Get USDC balance
      const usdcBalance = await client.readContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [checksumAddr]
      })

      // Get WETH balance
      const wethBalance = await client.readContract({
        address: WETH_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [checksumAddr]
      })

      setBalances({
        eth: formatEther(ethBalance),
        usdc: (Number(usdcBalance) / 1e6).toFixed(2),
        weth: formatEther(wethBalance as bigint)
      })
    } catch (error) {
      console.error('Fetch balances error:', error)
      setBalances({
        eth: '0.0000',
        usdc: '0.00',
        weth: '0.0000'
      })
    }
  }

  const connectWallet = async () => {
    try {
      const accounts = await sdk.wallet.ethProvider?.request({
        method: 'eth_requestAccounts'
      })
      
      if (accounts && accounts[0]) {
        setAddress(accounts[0])
        await fetchBalances(accounts[0])
      }
    } catch (error) {
      console.error('Connect wallet error:', error)
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💼 Base Portfolio</h1>
        
        {context?.user && (
          <div style={styles.userInfo}>
            <p style={styles.username}>@{context.user.username || 'User'}</p>
            <p style={styles.fid}>FID: {context.user.fid}</p>
          </div>
        )}

        {!address ? (
          <button 
            style={styles.connectButton}
            onClick={connectWallet}
          >
            🔗 Connect Wallet
          </button>
        ) : (
          <>
            <div style={styles.addressBox}>
              <p style={styles.addressLabel}>Wallet Address</p>
              <p style={styles.address}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>

            <div style={styles.balances}>
              <div style={styles.balanceItem}>
                <span style={styles.tokenSymbol}>ETH</span>
                <span style={styles.tokenBalance}>
                  {parseFloat(balances.eth || '0').toFixed(4)}
                </span>
              </div>

              <div style={styles.balanceItem}>
                <span style={styles.tokenSymbol}>USDC</span>
                <span style={styles.tokenBalance}>
                  ${balances.usdc || '0.00'}
                </span>
              </div>

              <div style={styles.balanceItem}>
                <span style={styles.tokenSymbol}>WETH</span>
                <span style={styles.tokenBalance}>
                  {parseFloat(balances.weth || '0').toFixed(4)}
                </span>
              </div>
            </div>

            <button 
              style={styles.refreshButton}
              onClick={() => address && fetchBalances(address)}
            >
              🔄 Refresh
            </button>
          </>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>Powered by Base ⚡</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0052FF 0%, #0066FF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '24px',
    color: '#1a1a1a'
  },
  userInfo: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    padding: '16px',
    background: '#f7f7f7',
    borderRadius: '12px'
  },
  username: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0052FF',
    margin: '0 0 8px 0'
  },
  fid: {
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  addressBox: {
    marginBottom: '24px',
    padding: '16px',
    background: '#f7f7f7',
    borderRadius: '12px',
    textAlign: 'center' as const
  },
  addressLabel: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px'
  },
  address: {
    fontSize: '14px',
    color: '#1a1a1a',
    margin: 0,
    fontFamily: 'monospace',
    fontWeight: '600'
  },
  balances: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginBottom: '24px'
  },
  balanceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f7f7f7',
    borderRadius: '12px'
  },
  tokenSymbol: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  tokenBalance: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0052FF'
  },
  connectButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #0052FF 0%, #0066FF 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '16px'
  },
  refreshButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #0052FF 0%, #0066FF 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center' as const
  },
  footerText: {
    fontSize: '12px',
    color: '#999',
    margin: 0
  },
  loader: {
    color: 'white',
    fontSize: '20px',
    textAlign: 'center' as const
  }
}
