export interface ActionPolicy {
    type: string;
    reward: number;
    token_name: string;
    bank_name: string;
}
export interface Reward {
    bank_name: string;
    action_type: string;
    user: string;
}