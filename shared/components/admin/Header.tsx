import Link from 'next/link';

export default function AdminHeader({
    profile,
}: {
    profile: { username?: string | null } | null;
}) {
    return (
        <>
            <div className="flex justify-between border-b border-gray-600 bg-gray-700 p-3 text-white">
                <Link href={'/'}>DN Mall</Link>

                <div>
                    <Link href="/admin">{profile?.username}</Link>
                </div>
            </div>
        </>
    );
}
