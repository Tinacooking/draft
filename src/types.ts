export interface Token {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  usdPrice: number;
  change24h: number;
  iconBg: string;
  chain: string;
}

export interface Network {
  id: string;
  name: string;
  shortName: string;
  nativeCurrency: string;
  gasPriceGwei: number;
  speed: 'Instant' | 'Normal' | 'Congested';
  color: string;
  blockExplorer: string;
}

export interface Transaction {
  id: string;
  hash: string;
  type: 'send' | 'receive' | 'checkout' | 'swap' | 'escrow';
  title: string;
  asset: string;
  amount: number;
  usdAmount: number;
  counterparty: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'escrow_locked';
  network: string;
  gasFee: string;
  memo?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  priceUsd: number;
  quantity: number;
}

export interface CheckoutInvoice {
  id: string;
  merchantName: string;
  merchantAddress: string;
  description: string;
  items: InvoiceItem[];
  totalUsd: number;
  selectedToken: string;
  cryptoAmount: string;
  depositAddress: string;
  status: 'unpaid' | 'confirming' | 'paid';
  expiresInSeconds: number;
  txHash?: string;
}
