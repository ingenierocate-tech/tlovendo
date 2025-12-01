import { IconType } from 'react-icons';

interface TagProps {
  icon: IconType;
  text: string;
}

export default function Tag({ icon: Icon, text }: TagProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 rounded-full">
      <Icon className="w-4 h-4 text-gray-600" aria-hidden="true" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}