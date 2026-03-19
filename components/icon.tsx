import { icons, type LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;

type IconProps = LucideProps & {
  name: IconName;
};

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = icons[name];
  return <LucideIcon {...props} />;
}
