import imgImage1 from "figma:asset/f457349b17fd05e4cc1022e536101af94fd58fcc.png";

export function Logo() {
  return (
    <div className="relative flex flex-col items-center" data-name="Logo">
      <div className="relative h-[133px] w-[188px]" data-name="image 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[248.86%] left-[-36.29%] max-w-none top-[-36.36%] w-[176.61%]" src={imgImage1} />
        </div>
      </div>
      <div className="relative h-[35px] w-[105px] ml-10 -mt-2" data-name="image 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[393.09%] left-[-14.82%] max-w-none top-[-211.98%] w-[131.12%]" src={imgImage1} />
        </div>
      </div>
    </div>
  );
}