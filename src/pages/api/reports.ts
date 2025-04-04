import type { NextApiRequest, NextApiResponse } from 'next'
import { isAddress } from '@/utils/ethereum'

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
  additionalInfo?: string;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'complete' | 'verified' | 'rejected';
}

type ResponseData = {
  success: boolean;
  data?: Report[];
  error?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // This would normally interact with a database
  // For demo purposes, we'll use mock data
  
  try {
    if (req.method === 'GET') {
      // Get query parameters
      const { address } = req.query
      
      // If address is provided, filter reports by that address
      if (address && typeof address === 'string') {
        if (!isAddress(address)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid Ethereum address'
          })
        }
        
        // In a real app, this would query your database
        // Mock response for demo
        const mockReports: Report[] = [
          {
            id: '1',
            reporterAddress: '0x1234567890123456789012345678901234567890',
            transactions: [
              {
                id: '1',
                fromAddress: '0x1234567890123456789012345678901234567890',
                toAddress: address,
                transactionHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
              }
            ],
            description: 'This address was involved in a phishing scam.',
            scamType: 'phishing',
            createdAt: new Date().toISOString(),
            status: 'complete'
          }
        ]
        
        return res.status(200).json({
          success: true,
          data: mockReports
        })
      }
      
      // Return all reports (would be paginated in a real app)
      const mockReports: Report[] = [
        {
          id: '1',
          reporterAddress: '0x1234567890123456789012345678901234567890',
          transactions: [
            {
              id: '1',
              fromAddress: '0x1234567890123456789012345678901234567890',
              toAddress: '0x0987654321098765432109876543210987654321',
              transactionHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
            }
          ],
          description: 'This address was involved in a phishing scam.',
          scamType: 'phishing',
          createdAt: new Date().toISOString(),
          status: 'complete'
        },
        {
          id: '2',
          reporterAddress: '0x2345678901234567890123456789012345678901',
          transactions: [
            {
              id: '1',
              fromAddress: '0x2345678901234567890123456789012345678901',
              toAddress: '0x8765432109876543210987654321098765432109',
              transactionHash: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
            }
          ],
          description: 'Fake token scam.',
          scamType: 'fake_token',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'verified'
        }
      ]
      
      return res.status(200).json({
        success: true,
        data: mockReports
      })
    }
    
    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  } catch (error) {
    console.error('Error handling reports:', error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}