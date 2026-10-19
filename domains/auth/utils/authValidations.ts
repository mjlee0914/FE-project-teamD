// 각 함수는 문제가 있으면 오류 문구를, 없으면 빈 문자열('')을 돌려준다.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9-]+$/;

export function validateEmail(email: string): string {
    if (email.trim() === '') {
        return '이메일을 입력해 주세요.';
    }

    if (!EMAIL_REGEX.test(email)) {
        return '이메일 형식이 올바르지 않습니다.';
    }

    return '';
}

// Supabase Auth는 비밀번호를 최소 8자로 요구한다.
export function validatePassword(password: string): string {
    if (password === '') {
        return '비밀번호를 입력해 주세요.';
    }

    if (password.length < 8) {
        return '비밀번호는 8자 이상 입력해 주세요.';
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
    if (name.trim() === '') {
        return '이름을 입력해 주세요.';
    }

    return '';
}

export function validatePhone(phone: string): string {
    if (phone.trim() === '') {
        return '전화번호를 입력해 주세요.';
    }

    if (!PHONE_REGEX.test(phone) || phone.length > 20) {
        return '전화번호 형식이 올바르지 않습니다.';
    }

    return '';
}

export function validateAddress(address: string): string {
    if (address.trim() === '') {
        return '주소를 입력해 주세요.';
    }

    if (address.length > 255) {
        return '주소는 255자 이하로 입력해 주세요.';
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
