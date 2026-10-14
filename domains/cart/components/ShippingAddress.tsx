import { Input } from '@/shared/components/ui/input';

export default function ShippingAdress() {
    return (
        <div className="flex flex-col gap-2 border p-4">
            <h2 className="font-bold">배송지</h2>

            <label htmlFor="recipient">받는 사람</label>
            <Input id="recipient" name="recipient" />
            <label htmlFor="phone">연락처</label>
            <Input id="phone" name="phone" type="tel" />
            <label htmlFor="address">주소</label>
            <Input id="address" name="address" />
            <label htmlFor="addressDetail">상세주소</label>
            <Input id="addressDetail" name="addressDetail" />
        </div>
    );
}
