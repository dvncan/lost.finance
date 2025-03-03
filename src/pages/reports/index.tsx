import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

type Report = {
  id: string;
  reporterAddress: string;
  transactions: Array<{
    id: string;
    fromAddress: string;
    toAddress: string;
    transactionHash: string;
  }>;
  description?: string;
  scamType?: string;
  optionalNote?: string;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'complete' | 'verified' | 'rejected';
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchReports = async () => {
      try {
        // For demo purposes, we'll use localStorage
        const storedReports = JSON.parse(localStorage.getItem('fraudReports') || '[]')
        setReports(storedReports)
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const getScamTypeLabel = (type?: string) => {
    if (!type) return 'Unknown'
    
    const types: Record<string, string> = {
      'phishing': 'Phishing Attack',
      'fake_token': 'Fake Token/Coin',
      'ponzi': 'Ponzi Scheme',
      'fake_exchange': 'Fake Exchange',
      'fake_giveaway': 'Fake Giveaway',
      'malicious_contract': 'Malicious Contract',
      'wallet_hack': 'Wallet Compromise',
      'impersonation': 'Impersonation',
      'rug_pull': 'Rug Pull',
      'other': 'Other'
    }
    
    return types[type] || 'Unknown'
  }

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      'pending': 'bg-yellow-900 text-yellow-300',
      'complete': 'bg-blue-900 text-blue-300',
      'verified': 'bg-green-900 text-green-300',
      'rejected': 'bg-red-900 text-red-300'
    }
    
    const statusLabels: Record<string, string> = {
      'pending': 'Pending',
      'complete': 'Complete',
      'verified': 'Verified',
      'rejected': 'Rejected'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-800 text-gray-300'}`}>
        {statusLabels[status] || 'Unknown'}
      </span>
    )
  }

  return (
    <>
      <Head>
        <title>Toxic List | Ethereum Fraud Registry | Cryptocurrency Scam Database</title>
        <meta name="description" content="Browse reported cryptocurrency scams and Ethereum fraud cases. Our blockchain security database helps identify malicious actors and prevent crypto theft." />
        <meta name="keywords" content="crypto scam reports, ethereum fraud registry, cryptocurrency scam database, blockchain security reports, crypto fraud cases, ethereum scam list, reported crypto scams, crypto theft database" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Toxic List | Ethereum Fraud Registry" />
        <meta property="og:description" content="Browse reported cryptocurrency scams and Ethereum fraud cases. Our blockchain security database helps identify malicious actors and prevent crypto theft." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ethfraudreport.com/reports" />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white glow-text">Toxic List</h1>
          <Link href="/report/new" className="btn btn-primary glow">
            Report Address
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-300">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-dark-800 rounded-lg shadow-lg border border-dark-700">
            <h2 className="text-xl font-medium text-white mb-4">No Crypto Scam Reports Found</h2>
            <p className="text-gray-400 mb-6">
              There are no cryptocurrency fraud reports in the system yet. Be the first to contribute to our blockchain security database.
            </p>
            <Link href="/report/new" className="btn btn-primary">
              Submit the First Report
            </Link>
          </div>
        ) : (
          <div className="bg-dark-800 shadow-lg overflow-hidden rounded-lg border border-dark-700 hover:glow transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-dark-600">
                <thead className="bg-dark-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Malicious Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Scam Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date Reported
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                   </tr>
                </thead>
                <tbody className="bg-dark-800 divide-y divide-dark-700">
                  {reports.map((report) => {
                    // Get the last transaction's toAddress as the malicious address
                    const lastTransaction = report.transactions[report.transactions.length - 1]
                    const maliciousAddress = lastTransaction ? lastTransaction.toAddress : 'Unknown'
                    
                    return (
                      <tr key={report.id} className="hover:bg-dark-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                          <span className="font-mono">
                            {report.reporterAddress.substring(0, 6)}...{report.reporterAddress.substring(report.reporterAddress.length - 4)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className="font-mono">
                            {maliciousAddress.substring(0, 6)}...{maliciousAddress.substring(maliciousAddress.length - 4)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {getScamTypeLabel(report.scamType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            href={`/report/${report.id}/view`}
                            className="text-primary-400 hover:text-primary-300"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-12 bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Cryptocurrency Scam Database</h2>
          <p className="text-gray-300 mb-4">
            Our comprehensive registry of reported crypto scams helps the blockchain community identify and avoid malicious actors. Each report is reviewed and verified to ensure accuracy.
          </p>
          <p className="text-gray-300">
            By maintaining this database of Ethereum fraud cases, we aim to improve cryptocurrency security and reduce instances of crypto theft across the ecosystem.
          </p>
        </div>
      </div>
    </>
  )
}