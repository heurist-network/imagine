import toast from 'react-hot-toast'
import { Client, Hash } from 'viem'

/**
 * Shows a success toast with a transaction link.
 * @param message - The success message
 * @param txHash - The transaction hash
 */
export const showSuccessToast = (
  client: Client,
  message: string,
  txHash?: Hash,
) => {
  const txUrl = txHash
    ? `${client?.chain?.blockExplorers?.default.url}/tx/${txHash}`
    : ''
  toast.success(
    <div>
      <div>{message}</div>
      {txUrl && (
        <a
          href={txUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 underline"
        >
          View in explorer.
        </a>
      )}
    </div>,
  )
}
