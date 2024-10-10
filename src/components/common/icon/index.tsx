import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { PackageBox } from "./package-box";
import { LoadPackages } from "./load-packages";
import { Marker } from "./marker";
import { TruckIcon } from "./truck";
import { CloseRouteIcon } from "./close-route";
import { WhatsappIcon } from "./whatsapp";
import { MapIcon } from "./map";
import { ReclaimIcon } from "./reclaim-icon";
import { LocationIcon } from "./location-icon";
import { BagIcon } from "./bag-icon";
import { DrawIcon } from "./draw-icon";
import ArrowBack from "./arrow-back";
import { DragIcon } from "./drag-icon";
import { DotIcon, SearchIcon } from "lucide-react";
import { Expand } from "./expand";
import { Contract } from "./contract";
import { SuccessIcon } from "./success-icon";
import { FailIcon } from "./fail-icon";
// Icons

const GetIcon: FunctionComponent<IconProps & { iconName: IconName }> = ({
  iconName,
  ...restOfProps
}) => {
  let DynamicIcon;
  switch (iconName) {
    case "package-box":
      DynamicIcon = PackageBox;
      break;
    case "load-packages":
      DynamicIcon = LoadPackages;
      break;
    case "marker":
      DynamicIcon = Marker;
      break;
    case "truck-icon":
      DynamicIcon = TruckIcon;
      break;
    case "close-route-icon":
      DynamicIcon = CloseRouteIcon;
      break;
    case "whatsapp":
      DynamicIcon = WhatsappIcon;
      break;
    case "map":
      DynamicIcon = MapIcon;
      break;
    case "reclaim-icon":
      DynamicIcon = ReclaimIcon;
      break;
    case "location-icon":
      DynamicIcon = LocationIcon;
      break;
    case "bag-icon":
      DynamicIcon = BagIcon;
      break;
    case "draw-icon":
      DynamicIcon = DrawIcon;
      break;
    case "arrow-back":
      DynamicIcon = ArrowBack;
      break;
    case "drag-icon":
      DynamicIcon = DragIcon;
      break;
    case "dot-icon":
      DynamicIcon = DotIcon;
      break;
    case "search-icon":
      DynamicIcon = SearchIcon;
      break;
    case "expand":
      DynamicIcon = Expand;
      break;
    case "contract":
      DynamicIcon = Contract;
      break;
    case "success-icon":
      DynamicIcon = SuccessIcon;
      break;
    case "fail-icon":
      DynamicIcon = FailIcon;
      break;
    default:
      return null;
  }
  //@ts-ignore
  return <DynamicIcon {...restOfProps} />;
};

export { GetIcon };
