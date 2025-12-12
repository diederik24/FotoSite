import Image from 'next/image';

export default function LogoBanner() {
  return (
    <div className="logo-banner">
      <Image 
        src="/Logo Links BOven .png" 
        alt="Straver Pflanzen Export" 
        width={300} 
        height={100}
        className="max-w-[300px] h-auto block"
      />
    </div>
  );
}

