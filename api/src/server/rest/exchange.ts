export interface ExchangeRequest {
    bank_name: string;
    orcid: string;
    from: string;
    to: string;
    value: number;
}

export interface ExchangePolicies {
    exchange_policies: ExchangePolicy[];
}

export interface ExchangePolicy {
    bank_name: string;
    token1_name: string;
    token2_name: string;
    rate: number;
}
