import Image from "next/image";
import keawade from "../public/assets/blog/authors/keawade.jpeg";

const Avatar = () => {
  return (
    <div className="flex items-center">
      <Image
        src={keawade}
        className="w-12 h-12 rounded-full mr-4"
        alt="Keith Wade"
      />
      <div className="text-xl font-bold">Keith Wade</div>
    </div>
  );
};

export default Avatar;
