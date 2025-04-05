import Head from 'next/head'
import Link from 'next/link'
import { ShieldExclamationIcon, DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <>
      <Head>
        <title>Ethereum Fraud Reporting | Crypto Scam Alert Registry | Report Crypto Scams</title>
        <meta name="description" content="Report cryptocurrency scams, verify Ethereum addresses, and protect yourself from crypto fraud. Our blockchain security tool helps identify malicious actors and prevent crypto theft." />
        <meta name="keywords" content="crypto scam, ethereum fraud, report crypto scam, cryptocurrency fraud, blockchain security, crypto theft, ethereum scam, crypto fraud detection, crypto scam alert, crypto fraud prevention" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Ethereum Fraud Reporting | Crypto Scam Alert Registry" />
        <meta property="og:description" content="Report cryptocurrency scams, verify Ethereum addresses, and protect yourself from crypto fraud. Our blockchain security tool helps identify malicious actors and prevent crypto theft." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ethfraudreport.com" />
        
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ethereum Fraud Reporting | Crypto Scam Alert Registry" />
        <meta name="twitter:description" content="Report cryptocurrency scams, verify Ethereum addresses, and protect yourself from crypto fraud. Our blockchain security tool helps identify malicious actors and prevent crypto theft." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 glow-text">
            Ethereum Fraud Reporting Registry
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Help protect the Ethereum community by reporting fraudulent transactions and malicious actors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card border-l-4 border-primary-500 hover:glow transition-all duration-300">
            <div className="flex items-start mb-4">
              <ShieldExclamationIcon className="h-8 w-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Report Crypto Scam</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Submit details about cryptocurrency scams, fraudulent transactions, and malicious actors to help warn others and prevent crypto theft.
            </p>
            <Link href="/report/new" className="btn btn-primary inline-block">
              Submit a Report
            </Link>
          </div>

          <div className="card border-l-4 border-primary-500 hover:glow transition-all duration-300">
            <div className="flex items-start mb-4">
              <DocumentTextIcon className="h-8 w-8 text-primary-500 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Verify Ethereum Address</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Check if an Ethereum address has been reported for crypto fraud before sending funds. Protect yourself from blockchain scams.
            </p>
            <Link href="/check" className="btn btn-primary inline-block">
              Check an Address
            </Link>
          </div>
        </div>

        <div className="card mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">How Our Crypto Scam Alert System Works</h2>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-dark-700 text-primary-400 mr-4 border border-primary-500">
                1
              </div>
              <div>
                <h3 className="font-medium text-white">Report Cryptocurrency Fraud</h3>
                <p className="text-gray-300">
                  Provide details about the fraudulent transaction, including your address, the malicious address, and transaction hashes to document crypto theft.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-dark-700 text-primary-400 mr-4 border border-primary-500">
                2
              </div>
              <div>
                <h3 className="font-medium text-white">Document the Crypto Scam</h3>
                <p className="text-gray-300">
                  Add additional information about how the fraud occurred to help others recognize similar cryptocurrency scams and improve blockchain security.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-dark-700 text-primary-400 mr-4 border border-primary-500">
                3
              </div>
              <div>
                <h3 className="font-medium text-white">Protect Against Crypto Fraud</h3>
                <p className="text-gray-300">
                  Your report helps others verify addresses before transactions, creating a safer Ethereum ecosystem and preventing future crypto scams.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 bg-opacity-70 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <ArrowPathIcon className="h-6 w-6 text-primary-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">Recent Crypto Scam Reports</h2>
          </div>
          <p className="text-gray-400 italic">
            Connect your wallet to view recent cryptocurrency fraud reports from the community.
          </p>
        </div>
        
        <section className="mt-12 text-gray-300">
          <h2 className="text-2xl font-semibold text-white mb-4">Protecting the Crypto Community from Scams</h2>
          <p className="mb-4">
            Cryptocurrency scams and Ethereum fraud are becoming increasingly sophisticated. Our blockchain security tool provides a central registry for reporting and verifying potentially malicious addresses.
          </p>
          <p className="mb-4">
            By contributing to our crypto scam alert system, you help protect others from falling victim to the same schemes. Together, we can make the cryptocurrency ecosystem safer for everyone.
          </p>
          <p>
            Whether you&apos;ve encountered phishing attempts, fake tokens, malicious smart contracts, or other forms of crypto theft, your reports provide valuable data that helps others avoid these threats.
          </p>
        </section>
      </div>
    </>
  )
}