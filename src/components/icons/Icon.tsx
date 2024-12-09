import {SvgXml} from 'react-native-svg';
import {IconName} from '../../constants/interfaces';
import PawnIcon from './PawnIcon';
import RookIcon from './RookIcon';
import BishopIcon from './BishopIcon';
import KnightIcon from './KnightIcon';
import KingIcon from './KingIcon';
import QueenIcon from './QueenIcon';
import LogoIcon from './LogoIcon';
import MenuIcon from './MenuIcon';
import LeftIcon from './LeftIcon';
import RightIcon from './RightIcon';

export default function Icon(props: {
  name: IconName['value'];
  size: number;
  color: string;
}) {
  const icons: Record<IconName['value'], any> = {
    Pawn: (
      <SvgXml
        xml={PawnIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Rook: (
      <SvgXml
        xml={RookIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Bishop: (
      <SvgXml
        xml={BishopIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Knight: (
      <SvgXml
        xml={KnightIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    King: (
      <SvgXml
        xml={KingIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Queen: (
      <SvgXml
        xml={QueenIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Logo: (
      <SvgXml
        xml={LogoIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Menu: (
      <SvgXml
        xml={MenuIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Left: (
      <SvgXml
        xml={LeftIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
    Right: (
      <SvgXml
        xml={RightIcon(props.color)}
        width={props.size}
        height={props.size}
      />
    ),
  };

  return icons[props.name];
}
