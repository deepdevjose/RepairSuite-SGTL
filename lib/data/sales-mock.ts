import type { SaleDetail, Payment, DailyCashReport, AccountReceivable } from "@/lib/types/sales"

// ============================================
// PAYMENTS
// ============================================

export const mockPayments: Payment[] = []

// ============================================
// SALES
// ============================================

export const mockSales: SaleDetail[] = []

// ============================================
// DAILY CASH REPORTS
// ============================================

export const mockDailyCashReports: DailyCashReport[] = []

// ============================================
// ACCOUNTS RECEIVABLE
// ============================================

export const mockAccountsReceivable: AccountReceivable[] = []

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSaleByFolio(folio: string): SaleDetail | undefined {
    return mockSales.find((s) => s.folioOS === folio)
}

export function getPaymentsByFolio(folio: string): Payment[] {
    return mockPayments.filter((p) => p.folioOS === folio)
}

export function getAllSales(): SaleDetail[] {
    return mockSales
}

export function getAllPayments(): Payment[] {
    return mockPayments
}

export function getAccountsReceivable(): AccountReceivable[] {
    return mockAccountsReceivable
}
