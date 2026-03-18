import Image from "next/image";

export default async function Header() {
  return (
    <header className="bg-white px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center">
        <Image src="/images/logo.png" alt="AnyMall" width={113} height={37} />
      </div>
    </header>
  );
}
