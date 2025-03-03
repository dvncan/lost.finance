import type { NextApiRequest, NextApiResponse } from 'next'
import { isAddress } from '@/utils/ethereum'

type ResponseData = {
  status: 'malicious' | 'safe' | 'error';
  details?: any;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { address } = req.query
    
    // Validate address
    if (!address || typeof address !== 'string' || !isAddress(address)) {
      return res.status(400).json({ 
        status: 'error', 
        details: 'Invalid Ethereum address' 
      })
    }
    
    // In a real app, this would query your database
    // For demo purposes, we'll use localStorage on the client side
    // This API endpoint would normally check a database
    
    // Mock response for demo
    // In production, this would check your database of reported addresses
    const isMalicious = Math.random() > 0.7 // Random for demo purposes
    
    if (isMalicious) {
      return res.status(200).json({
        status: 'malicious',
        details: {
          reportCount: Math.floor(Math.random() * 10) + 1,
          latestReport: {
            createdAt: new Date().toISOString(),
            description: 'This address was involved in a phishing scam that stole funds from multiple users.'
          }
        }
      })
    } else {
      return res.status(200).json({
        status: 'safe'
      })
    }
  } catch (error) {
    console.error('Error checking address:', error)
    return res.status(500).json({ 
      status: 'error', 
      details: 'Server error while checking address' 
    })
  }
}