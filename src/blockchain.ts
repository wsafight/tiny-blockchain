import sha256 from 'sha256'

class Blockchain {
    chain: any[] = []
    pendingTransactions: any[] = []

    constructor() {
        this.createNewBlock({
            nonce: 100,
            hash: '0',
            previousBlockHash: '0',
        })
    }

    createNewBlock ({
        nonce,
        hash,
        previousBlockHash,
    }: Record<string, any>) {
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

    createNewTransaction = ({
        amount,
        sender,
        recipient,
    }: Record<string, any>) => {
        const newTransaction = {
            amount,
            sender,
            recipient,
        }
        this.pendingTransactions.push(newTransaction)
        return (this.getLastBlock()?.index ?? 0) + 1
    }

    hashBlock = ({
        previousBlockHash,
        currentBlockData,
        nonce,
    }: Record<string, any>): string => {
        const dataStr = previousBlockHash + nonce.tostring()+ JSON.stringify( currentBlockData);
        return sha256(dataStr)
    }

    proofOfWork = ({
        previousBlockHash,
        currentBlockData,
    }: Record<string, any>) => {
        let nonce: number = 0
        let hash: string = ''
        do {
            hash = this.hashBlock({
                previousBlockHash,
                currentBlockData,
                nonce: nonce++,
            })
        } while(hash.substring(0, 4) !== '0000')
        return nonce
    }

    getLastBlock = () => {
        return this.chain[this.chain.length - 1]
    }
}