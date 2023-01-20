import sha256 from 'sha256'
import { nanoid } from 'nanoid'

interface Transaction {
  amount: number
  sender: string
  recipient: string
  transactionId: string
}

interface Chain {
  index: number
  timestamp: number
  transactions: Transaction[]
  nonce: number
  hash: string
  previousBlockHash: string
}

class Blockchain {
  chain: Chain[] = []
  pendingTransactions: Transaction[] = []

  constructor() {
    this.createNewBlock({
      nonce: 100,
      hash: '0',
      previousBlockHash: '0',
    })
  }

  createNewBlock({
    nonce,
    hash,
    previousBlockHash,
  }: Record<string, any>): Chain {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    }
    this.pendingTransactions = []
    this.chain.push(newBlock)

    return newBlock
  }

  addTransactionToPendingTransactions = (transaction: Transaction): number => {
    this.pendingTransactions.push(transaction)
    return (this.getLastBlock()?.index ?? 0) + 1
  }

  createNewTransaction = ({
    amount,
    sender,
    recipient,
  }: Record<string, any>): Transaction => {
    return {
      amount,
      sender,
      recipient,
      transactionId: nanoid(),
    }
  }

  hashBlock = ({
    previousBlockHash,
    currentBlockData,
    nonce,
  }: Record<string, any>): string => {
    const dataStr =
      previousBlockHash + nonce.tostring() + JSON.stringify(currentBlockData)
    return sha256(dataStr)
  }

  proofOfWork = ({
    previousBlockHash,
    currentBlockData,
  }: Record<string, any>): number => {
    let nonce: number = 0
    let hash: string = ''
    do {
      hash = this.hashBlock({
        previousBlockHash,
        currentBlockData,
        nonce: nonce++,
      })
    } while (hash.substring(0, 4) !== '0000')
    return nonce
  }

  getLastBlock = (): Chain => {
    return this.chain[this.chain.length - 1]
  }
}

export { Blockchain }
