import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, useFieldArray } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { isAddress, isTransactionHash } from '@/utils/ethereum'

type TransactionEntry = {
  id: string;
  fromAddress: string;
  toAddress: string;
  transactionHash: string;
}

type FormData = {
  reporterAddress: string;
  transactions: TransactionEntry[];
}

export default function NewReport() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      reporterAddress: '',
      transactions: [
        { id: uuidv4(), fromAddress: '', toAddress: '', transactionHash: '' }
      ]
    }
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactions"
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // In a real app, this would send data to your backend
      console.log('Report data:', data)
      
      // Store in localStorage for demo purposes
      const reportId = uuidv4()
      const report = {
        id: reportId,
        reporterAddress: data.reporterAddress,
        transactions: data.transactions,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      
      // Get existing reports or initialize empty array
      const existingReports = JSON.parse(localStorage.getItem('fraudReports') || '[]')
      localStorage.setItem('fraudReports', JSON.stringify([...existingReports, report]))
      
      // Navigate to additional info page
      router.push(`/report/${reportId}/details`)
    } catch (error) {
      console.error('Error submitting report:', error)
      alert('Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Report Crypto Scam | Document Ethereum Fraud | Cryptocurrency Theft Reporting</title>
        <meta name="description" content="Report cryptocurrency scams and Ethereum fraud. Document blockchain scams, phishing attempts, and malicious actors to protect the crypto community from theft." />
        <meta name="keywords" content="report crypto scam, ethereum fraud report, cryptocurrency theft, report blockchain scam, crypto fraud reporting, document crypto scam, ethereum scam alert, crypto phishing report" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="Report Crypto Scam | Document Ethereum Fraud" />
        <meta property="og:description" content="Report cryptocurrency scams and Ethereum fraud. Document blockchain scams, phishing attempts, and malicious actors to protect the crypto community from theft." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ethfraudreport.com/report/new" />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8 text-white glow-text">Report Cryptocurrency Fraud</h1>
        
        <div className="card hover:glow transition-all duration-300">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="reporterAddress" className="label">Your Ethereum Address</label>
              <input
                id="reporterAddress"
                type="text"
                className="input"
                placeholder="0x..."
                {...register("reporterAddress", { 
                  required: "Your address is required",
                  validate: value => isAddress(value) || "Invalid Ethereum address"
                })}
              />
              {errors.reporterAddress && (
                <p className="mt-1 text-sm text-danger-400">{errors.reporterAddress.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Crypto Scam Transaction Trail</h2>
              <p className="text-gray-300 mb-4">
                Add the sequence of transactions that led to the fraud. This helps establish the path from your address to the final malicious address and document the cryptocurrency theft.
              </p>
              
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-dark-600 rounded-lg bg-dark-900">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-white">Transaction {index + 1}</h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-danger-400 hover:text-danger-300 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="label">From Address</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="0x..."
                          {...register(`transactions.${index}.fromAddress`, {
                            required: "From address is required",
                            validate: value => isAddress(value) || "Invalid Ethereum address"
                          })}
                        />
                        {errors.transactions?.[index]?.fromAddress && (
                          <p className="mt-1 text-sm text-danger-400">
                            {errors.transactions[index]?.fromAddress?.message}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="label">To Address (Scammer)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="0x..."
                          {...register(`transactions.${index}.toAddress`, {
                            required: "To address is required",
                            validate: value => isAddress(value) || "Invalid Ethereum address"
                          })}
                        />
                        {errors.transactions?.[index]?.toAddress && (
                          <p className="mt-1 text-sm text-danger-400">
                            {errors.transactions[index]?.toAddress?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="label">Transaction Hash (Evidence)</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="0x..."
                        {...register(`transactions.${index}.transactionHash`, {
                          required: "Transaction hash is required",
                          validate: value => isTransactionHash(value) || "Invalid transaction hash"
                        })}
                      />
                      {errors.transactions?.[index]?.transactionHash && (
                        <p className="mt-1 text-sm text-danger-400">
                          {errors.transactions[index]?.transactionHash?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={() => append({ id: uuidv4(), fromAddress: '', toAddress: '', transactionHash: '' })}
                className="btn btn-secondary mt-4"
              >
                Add Another Transaction
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Continue to Document Scam Details'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Why Report Cryptocurrency Scams?</h2>
          <p className="text-gray-300 mb-4">
            By reporting crypto fraud and scams, you help protect others in the blockchain community from falling victim to the same schemes. Your reports contribute to a safer cryptocurrency ecosystem.
          </p>
          <p className="text-gray-300">
            Each documented case helps improve fraud detection systems and raises awareness about common scam techniques in the Ethereum network.
          </p>
        </div>
      </div>
    </>
  )
}