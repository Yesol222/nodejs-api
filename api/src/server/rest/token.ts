export interface InflationPolicy {
  inflation_type: string;
  base_line_type: string;
  period: string;
  inflation_value: number;
  latest_inflation_value?: number;
}

export interface Tokens {
  tokens: Token[];
}

export interface Token {
  bank_name: string;
  token_name: string;
  admin: string;
  balance: number;
  initialization_balance: number;
  global_amount?: number;
  inflation_policy: InflationPolicy;
}

export interface Transfer {
  bank_name: string;
  token_name: string;
  from: string;
  to: string;
  value: number;
}
