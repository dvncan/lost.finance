import Head from 'next/head'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { isAddress } from '@/utils/ethereum'

type FormData = {
  address: string
}

export default function CheckAddress() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [result, setResult] = useState<{ status: string; details?: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/check-address?address=${data.address}`)
      const resultData = await response.json()
      setResult(resultData)
    } catch (error) {
      console.error('Error checking address:', error)
      setResult({ status: 'error', details: 'Failed to check address' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Verify Ethereum Address | Check for Crypto Scams | Blockchain Security Tool</title>
        <meta name="description" content="Verify Ethereum addresses before sending funds. Our crypto fraud detection tool checks if an address has been reported for scams, helping you avoid cryptocurrency theft." />
        <meta name="keywords" content="verify ethereum address, check crypto scam, crypto fraud detection, blockchain security check, ethereum address verification, crypto scam checker, cryptocurrency security, crypto fraud prevention" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Verify Ethereum Address | Check for Crypto Scams" />
        <meta property="og:description" content="Verify Ethereum addresses before sending funds. Our crypto fraud detection tool checks if an address has been reported for scams, helping you avoid cryptocurrency theft." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ethfraudreport.com/check" />
      </Head>

      <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8 text-white glow-text">Verify Ethereum Address</h1>
        
        <div className="card mb-8 hover:glow transition-all duration-300">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="address" className="label">Ethereum Address to Verify</label>
              <input
                id="address"
                type="text"
                className="input"
                placeholder="0x..."
                {...register("address", { 
                  required: "Address is required",
                  validate: value => isAddress(value) || "Invalid Ethereum address"
                })}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-danger-400">{errors.address.message}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Verify Address for Scams'}
            </button>
          </form>
        </div>

        {result && (
          <div className={`card border-l-4 ${
            result.status === 'malicious' 
              ? 'border-danger-500 bg-dark-900' 
              : result.status === 'safe' 
                ? 'border-green-500 bg-dark-900'
                : 'border-yellow-500 bg-dark-900'
          } animate-fadeIn`}>
            <h2 className="text-xl font-semibold mb-2 text-white">
              {result.status === 'malicious' 
                ? '⚠️ Malicious Address Detected' 
                : result.status === 'safe'
                  ? '✅ Address Appears Safe'
                  : '⚠️ Error Checking Address'}
            </h2>
            
            {result.status === 'malicious' && result.details && (
              <div className="space-y-2">
                <p className="text-danger-400">
                  This address has been reported as malicious by {result.details.reportCount} user(s). Potential crypto scam detected.
                </p>
                {result.details.latestReport && (
                  <div className="mt-4">
                    <p className="font-medium text-white">Latest report:</p>
                    <p className="text-sm text-gray-400">
                      {new Date(result.details.latestReport.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      {result.details.latestReport.description.substring(0, 100)}
                      {result.details.latestReport.description.length > 100 ? '...' : ''}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {result.status === 'safe' && (
              <p className="text-green-400">
                No malicious reports found for this address. However, always exercise caution when interacting with any cryptocurrency address to prevent fraud.
              </p>
            )}
            
            {result.status === 'error' && (
              <p className="text-yellow-400">
                {result.details || 'There was an error checking this address. Please try again.'}
              </p>
            )}
          </div>
        )}
        
        <div className="mt-12 bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Why Verify Ethereum Addresses?</h2>
          <p className="text-gray-300 mb-4">
            Cryptocurrency scams and fraud are increasingly common in the blockchain ecosystem. Before sending funds or interacting with any Ethereum address, it's crucial to verify its legitimacy.
          </p>
          <p className="text-gray-300 mb-4">
            Our crypto fraud detection tool checks addresses against a community-maintained database of reported scams, helping you make informed decisions and protect your digital assets.
          </p>
          <p className="text-gray-300">
            Remember: Always verify before you transact. Blockchain transactions cannot be reversed once confirmed.
          </p>
        </div>
      </div>
    </>
  )
}