// Form Action(useActionState)의 상태 모양
export interface ActionState {
    success: boolean;
    errors?: Record<string, string>;
    data?: unknown;
    values?: Record<string, string>;
}

export const INITIAL_ACTION_STATE: ActionState = { success: false };
