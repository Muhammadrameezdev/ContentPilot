import Image from "next/image";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  image?: string | null;
  size?: number;
  className?: string;
};

function isValidImageUrl(value?: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function UserAvatar({ name, image, size = 32, className }: UserAvatarProps) {
  const initials = name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const avatarClass = cn(
    "inline-flex items-center justify-center overflow-hidden rounded-full bg-primary text-white font-semibold",
    className
  );

  if (isValidImageUrl(image)) {
    return (
      <div className={avatarClass} style={{ width: size, height: size }}>
        <Image
          src={image as string}
          alt={name}
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={avatarClass} style={{ width: size, height: size }}>
      <span className="text-sm leading-none">{initials}</span>
    </div>
  );
}
