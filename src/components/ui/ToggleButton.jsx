import { Switch } from "@material-tailwind/react";
 
export function ToggleButton() {
  return (
    <Switch
      id="custom-switch-component"
      ripple={false}
      className="h-full w-full checked:bg-[#FFB92D]"
      containerProps={{
        className: "w-8 h-3",
      }}
      circleProps={{
        className: "before:hidden left-0.5 border-none w-4 h-4 ",
      }}
    />
  );
}