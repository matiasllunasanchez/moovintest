import Image from "next/image";
const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-[50px] font-bold mb-6">Oops!</h2>
      <h3 className="text-xl font-bold mb-6 ">
        Esta sección se encuentra en construcción
      </h3>
      <div className="flex justify-center  h-full">
        <Image src="/wip.png" alt="Logo" width={500} height={50} />
      </div>
    </div>
  );
};

export default UnderConstruction;
