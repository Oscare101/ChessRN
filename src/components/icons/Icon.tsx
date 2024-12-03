import {SvgXml} from 'react-native-svg';
import {IconName} from '../../constants/interfaces';
import PawnIcon from './PawnIcon';
import RookIcon from './RookIcon';
import BishopIcon from './BishopIcon';
import KnightIcon from './KnightIcon';
import KingIcon from './KingIcon';
import QueenIcon from './QueenIcon';

export default function Icon(props: {
  name: IconName['value'];
  size: number;
  color: string;
}) {
  const icons: Record<IconName['value'], any> = {
    Pawn: (
      <SvgXml
        xml={PawnIcon(props.color)}
        width={props.size * 0.9}
        height={props.size * 0.9}
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
  };

  return icons[props.name];
}
