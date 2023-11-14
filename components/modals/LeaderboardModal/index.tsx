import { CommonModalProps } from "@/constants/modals";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";

export default function LeaderboardModal({ handleClose }: CommonModalProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative text-black h-3/4 min-h-[50rem] w-5/6 rounded-lg border-0 bg-gray-200 p-4 shadow-lg sm:h-3/4 sm:w-5/6 md:h-3/4 md:w-5/6 lg:h-3/4 lg:w-5/6 xl:h-3/4 xl:w-5/6 2xl:h-3/4 2xl:w-2/3">
        <XMarkIcon
          className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
          onClick={handleClose}
        />
        <span>HELLO</span>
      </div>
    </div>
  );
}
