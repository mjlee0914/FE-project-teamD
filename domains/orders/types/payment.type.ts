export type JsonValue =
    | string
    | number
    | boolean
    | null
    | { [key: string]: JsonValue }
    | JsonValue[];

export interface Payment {
    id: string;
    order_id: string;
    payment_method: string | null;
    payment_key: string | null;
    approved_at: string | null;
    raw_data: JsonValue | null;
    amount: number | null;
    status: string | null;
}
