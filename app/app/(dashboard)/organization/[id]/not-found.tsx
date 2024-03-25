import Image from "next/image";

export default function NotFoundOrg() {
  return (
    <div className="mt-20 flex flex-col items-center space-x-4">
      <h1 className="text-4xl">404</h1>
      <Image
        alt="missing organziation"
        src="https://illustrations.popsy.co/gray/falling.svg"
        width={400}
        height={400}
        className="dark:hidden"
      />
      <Image
        alt="missing organziation"
        src="https://illustrations.popsy.co/white/falling.svg"
        width={400}
        height={400}
        className="hidden dark:block"
      />
      <p className="text-lg">
        Organziation does not exist, or you do not have permission to view it
      </p>
    </div>
  );
}
