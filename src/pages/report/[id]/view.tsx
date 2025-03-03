import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { shortenAddress, shortenTxHash } from '@/utils/ethereum'

export default function ViewReport() {
  const router = useRouter()
  const { id } = router.query
  const [report, setReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // In a real app, this would fetch from your API
      const reports = JSON.parse(localStorage.getItem('fraudReports') || '[]')
      const foundReport = reports.find((r: any) => r.id === id)
      
      if (foundReport) {
        setReport(foundReport)
      } else {
        router.push('/reports')
      }
      
      setIsLoading(false)
    }
  }, [id, router])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-300">Loading report details...</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-300">Report not found. Redirecting...</p>
      </div>
    )
  }

  const getScamTypeLabel = (type?: string) => {
    if (!type) return 'Unknown'
    
    const types: Record<string, string> = {
      'phishing': 'Phishing Attack',
      'fake_token': 'Fake Token/Coin',
      'ponzi': 'Ponzi Scheme',
      'fake_exchange': 'Fake Exchange',
      'fake_giveaway': 'Fake Giveaway',
      'malicious_contract': 'Malicious Smart Contract',
      'wallet_hack': 'Wallet Compromise',
      'impersonation': 'Impersonation',
      'rug_pull': 'Rug Pull',
      'other': 'Other'
    }
    
    return types[type] || 'Unknown'
  }

  return (
    <>
      <Head>
        <title>Crypto Scam Details | Ethereum Fraud Case #{id?.toString().substring(0, 8)} | Blockchain Security</title>
        <meta name="description" content={`Detailed report of cryptocurrency fraud case involving ${report.transactions[report.transactions.length - 1]?.toAddress.substring(0, 10)}... Learn how this crypto scam operated to protect yourself from similar threats.`} />
        <meta name="keywords" content="crypto scam details, ethereum fraud case, cryptocurrency theft report, blockchain security alert, crypto fraud evidence, ethereum scam example, crypto scam techniques, malicious address report" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={`Crypto Scam Details | Ethereum Fraud Case #${id?.toString().substring(0, 8)}`} />
        <meta property="og:description" content={`Detailed report of cryptocurrency fraud case involving ${report.transactions[report.transactions.length - 1]?.toAddress.substring(0, 10)}... Learn how this crypto scam operated to protect yourself from similar threats.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://ethfraudreport.com/report/${id}/view`} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="mb-8">
          <Link href="/reports" className="inline-flex items-center text-primary-400 hover:text-primary-300">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Toxic List
          </Link>
        </div>
        
        <div className="bg-dark-800 shadow-lg overflow-hidden rounded-lg mb-8 border border-dark-700 hover:glow transition-all duration-300">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-dark-700">
            <div>
              <h1 className="text-2xl font-bold text-white">Cryptocurrency Fraud Report</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-400">
                Report ID: {report.id}
              </p>
            </div>
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-danger-500 mr-2" />
              <span className="font-medium text-danger-400">
                {getScamTypeLabel(report.scamType)} Scam
              </span>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Reporter Address</dt>
                <dd className="mt-1 text-sm text-gray-200 font-mono break-all">
                  {report.reporterAddress}
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Date Reported</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  {new Date(report.createdAt).toLocaleString()}
                </dd>
              </div>
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-400">Crypto Scam Transaction Trail</dt>
                <dd className="mt-1 text-sm text-gray-200">
                  <div className="border border-dark-600 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-dark-600">
                      <thead className="bg-dark-900">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            From
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            To
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Transaction
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-dark-800 divide-y divide-dark-700">
                        {report.transactions.map((tx: any, index: number) => (
                          <tr key={tx.id} className={index === report.transactions.length - 1 ? 'bg-danger-900 bg-opacity-40' : ''}>
                            <td className="px-4 py-3 text-sm font-mono text-gray-300">
                              {shortenAddress(tx.fromAddress)}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-300">
                              {shortenAddress(tx.toAddress)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <a 
                                href={`https://etherscan.io/tx/${tx.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-400 hover:text-primary-300 font-mono"
                              >
                                {shortenTxHash(tx.transactionHash)}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </dd>
              </div>
              
              {report.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-400">Scam Description</dt>
                  <dd className="mt-1 text-sm text-gray-200 whitespace-pre-line">
                    {report.description}
                  </dd>
                </div>
              )}
              
              {report.additionalInfo && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-400">Additional Information</dt>
                  <dd className="mt-1 text-sm text-gray-200 whitespace-pre-line">
                    {report.additionalInfo}
                  </dd>
                </div>
              )}
              
              {report.optionalNote && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-400">Personal Note (Not stored on-chain)</dt>
                  <dd className="mt-1 text-sm text-gray-200 whitespace-pre-line bg-dark-900 p-3 rounded-md border border-dark-600">
                    {report.optionalNote}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link href="/reports" className="btn btn-secondary">
            Back to Toxic List
          </Link>
          <Link href="/check" className="btn btn-primary">
            Check Another Address
          </Link>
        </div>
        
        <div className="mt-8 bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Protect Yourself from Crypto Scams</h2>
          <p className="text-gray-300 mb-4">
            This report documents a real cryptocurrency fraud case. By studying how these scams operate, you can better protect yourself from similar threats in the blockchain ecosystem.
          </p>
          <p className="text-gray-300">
            Always verify addresses before sending funds, be wary of offers that seem too good to be true, and use our address verification tool to check for reported scams.
          </p>
        </div>
      </div>
    </>
  )
}