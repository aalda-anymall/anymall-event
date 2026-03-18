import Image from "next/image";

export default async function Header() {
  return (
    <header className="flex items-center bg-white px-4 py-3">
      <Image src="/images/logo.png" alt="AnyMall" width={113} height={37} />
    </header>
  );
}
