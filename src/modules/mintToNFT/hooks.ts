import { create } from 'zustand'

interface BearState {
  loading: boolean
  setLoading: (loading: boolean) => void
  referralAddress: string
  setReferralAddress: (referralAddress: string) => void
}

export const useMintToNFT = create<BearState>()((set) => ({
  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
  referralAddress: '',
  setReferralAddress: (referralAddress) => set(() => ({ referralAddress })),
}))
