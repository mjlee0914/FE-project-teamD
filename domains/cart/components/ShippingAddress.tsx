import { Input } from '@/shared/components/ui/input';

export default function ShippingAddress() {
    return (
        <div className="flex flex-col gap-6 rounded-lg border p-6">
            <h2 className="text-lg font-bold">고객 배송지 정보</h2>
            <div className="grid items-center gap-x-30 gap-y-8 md:grid-cols-[6rem_1fr]">
                <label
                    className="text-md justify-self-end font-bold"
                    htmlFor="recipient"
                >
                    받는 사람
                </label>
                <Input id="recipient" name="recipient" />
                <label
                    className="text-md justify-self-end font-bold"
                    htmlFor="phone"
                >
                    연락처
                </label>
                <Input id="phone" name="phone" type="tel" />
                <label
                    className="text-md justify-self-end font-bold"
                    htmlFor="address"
                >
                    주소
                </label>
                <Input id="address" name="address" />
                <label
                    className="text-md justify-self-end font-bold"
                    htmlFor="addressDetail"
                >
                    상세주소
                </label>
                <Input id="addressDetail" name="addressDetail" />
            </div>
        </div>
    );
}
