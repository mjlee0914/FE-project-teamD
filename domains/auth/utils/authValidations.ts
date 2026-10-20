// 각 함수는 문제가 있으면 오류 문구를, 없으면 빈 문자열('')을 돌려준다.

// 입력칸 maxLength와 서버 검사에서 같이 쓰는 글자 수 제한
export const FIELD_MAX_LENGTH = {
    email: 100,
    name: 20,
    password: 72, // Supabase(bcrypt)는 72자까지만 비밀번호로 쓴다
    phone: 13, // 010-1234-5678
    address: 100,
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 한글·영문·공백만 (숫자, 특수문자 X)
const NAME_REGEX = /^[가-힣a-zA-Z\s]+$/;
// 하이픈을 뺀 휴대폰 번호: 010·011·016·017·018·019 + 7~8자리
const PHONE_DIGITS_REGEX = /^01[016789]\d{7,8}$/;
// 주소는 시·도 이름으로 시작해야 한다 (예: "서울특별시 구로구 ...", "경기 성남시 ...")
const ADDRESS_START_REGEX =
    /^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|충청북도|충청남도|전북|전남|전라북도|전라남도|경북|경남|경상북도|경상남도|제주)/;

// "010 1234 5678", "01012345678" → "010-1234-5678" 처럼 한 가지 모양으로 맞춘다.
// 모양을 맞춰야 DB에서 중복 전화번호를 찾을 수 있다.
export function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone.trim();
}

export function validateEmail(email: string): string {
    if (email.trim() === '') {
        return '이메일을 입력해 주세요.';
    }

    if (email.length > FIELD_MAX_LENGTH.email) {
        return `이메일은 ${FIELD_MAX_LENGTH.email}자 이하로 입력해 주세요.`;
    }

    if (!EMAIL_REGEX.test(email)) {
        return '이메일 형식이 올바르지 않습니다.';
    }

    return '';
}

// 우리 팀 규칙: 비밀번호 최소 8자
export function validatePassword(password: string): string {
    if (password === '') {
        return '비밀번호를 입력해 주세요.';
    }

    if (password.length < 8) {
        return '비밀번호는 8자 이상 입력해 주세요.';
    }

    if (password.length > FIELD_MAX_LENGTH.password) {
        return `비밀번호는 ${FIELD_MAX_LENGTH.password}자 이하로 입력해 주세요.`;
    }

    return '';
}

export function validatePasswordConfirm(
    password: string,
    passwordConfirm: string,
): string {
    if (passwordConfirm === '') {
        return '비밀번호 확인을 입력해 주세요.';
    }

    if (password !== passwordConfirm) {
        return '비밀번호가 일치하지 않습니다.';
    }

    return '';
}

export function validateName(name: string): string {
    const trimmed = name.trim();

    if (trimmed === '') {
        return '이름을 입력해 주세요.';
    }

    if (trimmed.length < 2 || trimmed.length > FIELD_MAX_LENGTH.name) {
        return `이름은 2~${FIELD_MAX_LENGTH.name}자로 입력해 주세요.`;
    }

    if (!NAME_REGEX.test(trimmed)) {
        return '이름은 한글 또는 영문만 입력할 수 있습니다.';
    }

    return '';
}

export function validatePhone(phone: string): string {
    if (phone.trim() === '') {
        return '전화번호를 입력해 주세요.';
    }

    // 숫자·하이픈·공백 말고 다른 글자가 있으면 바로 오류
    if (!/^[0-9\-\s]+$/.test(phone)) {
        return '전화번호는 숫자만 입력해 주세요.';
    }

    if (!PHONE_DIGITS_REGEX.test(phone.replace(/\D/g, ''))) {
        return '휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
    }

    return '';
}

export function validateAddress(address: string): string {
    const trimmed = address.trim();

    if (trimmed === '') {
        return '주소를 입력해 주세요.';
    }

    if (trimmed.length < 5 || trimmed.length > FIELD_MAX_LENGTH.address) {
        return `주소는 5~${FIELD_MAX_LENGTH.address}자로 입력해 주세요.`;
    }

    if (!ADDRESS_START_REGEX.test(trimmed)) {
        return '주소는 시·도부터 입력해 주세요. (예: 서울특별시 구로구 ...)';
    }

    return '';
}

export interface SignUpValues {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phone: string;
    address: string;
}

// 회원가입 칸을 한 번에 검사해서, 문제가 있는 칸만 { 칸이름: 오류 문구 }로 모은다.
// 돌려받은 객체가 비어 있으면 모두 통과한 것이다.
export function validateSignUp(values: SignUpValues): Record<string, string> {
    const results: Record<string, string> = {
        name: validateName(values.name),
        email: validateEmail(values.email),
        password: validatePassword(values.password),
        passwordConfirm: validatePasswordConfirm(
            values.password,
            values.passwordConfirm,
        ),
        phone: validatePhone(values.phone),
        address: validateAddress(values.address),
    };

    const errors: Record<string, string> = {};
    for (const [field, message] of Object.entries(results)) {
        if (message !== '') {
            errors[field] = message;
        }
    }

    return errors;
}
