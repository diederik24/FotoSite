import Image from 'next/image';

export default function Footer() {
  return (
    <>
      <div className="footer">
        <div className="footer-line">
          <Image
            src="/Golf Onder.png"
            alt=""
            width={500}
            height={100}
            className="w-full h-auto block"
          />
        </div>
      </div>
      <div className="copyright">
        Copyright 2025 © StraverPflanzenExport
      </div>
    </>
  );
}


