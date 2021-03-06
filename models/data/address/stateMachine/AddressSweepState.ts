import {Network} from '../../../types/AccountTypes';

// @deprecated
export interface AddressSweepState {
    network: Network;
    address: string;
    currency: string;
    evidenceTransactionId: string;
    sweep: {
        state: 'none' | 'failed' | 'sweepSubmitted' | 'sweeped' | 'almostEmpty',
        calculatedGas: string,
        transactionId: string,
        sweepTransactionId?: string,
        gasSubmittedTime?: number;
        sweepSubmittedTime?: number;
        reason?: string,
    };
}
