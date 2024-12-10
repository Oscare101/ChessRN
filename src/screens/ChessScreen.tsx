import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import rules from '../constants/rules';
import RenderRowItem from '../components/chess/RenderRowItem';
import {
  GameStatInterface,
  PiecePlacementLogArrayType,
  PiecePlacementLogType,
  PiecePlacementType,
  PieceType,
} from '../constants/interfaces';
import colors from '../constants/colors';
import {KnightMovement} from '../functions/knightMovement';
import {PawnMovement} from '../functions/pawnMovement';
import {LineMovement} from '../functions/lineMovement';
import {DiagonalMovement} from '../functions/diagonalMovement';
import {KingMovement} from '../functions/kingMovement';
import {MakeMove} from '../functions/makeMove';
import {
  CheckThreefoldRepetition,
  IsCheckmate,
  IsKingChecked,
  IsPawnPromotion,
  IsStalemate,
  OnlyKingsLeft,
  SimulateMove,
} from '../functions/chessFunctions';
import PlayerStatBlock from './PlayerStatBlock';
import startPiecePlacement from '../constants/StartPiecePlacement';
import PromotionModal from './PromotionModal';

const width = Dimensions.get('screen').width;

const startTime = 600;
const increment = 10;

const startPositions: GameStatInterface = {
  gameResult: null,
  check: null,
  checkmate: null,
  takenPieces: [],
  step: 'white',
  movesHistory: [],
  activeCell: null,
  routeCells: [],
  castlingInfo: [
    {
      whiteKingMoved: false,
      '0RookMoved': false,
      '7RookMoved': false,
      blackKingMoved: false,
      '56RookMoved': false,
      '63RookMoved': false,
    },
  ],
  piecesPlacementLog: startPiecePlacement,
  isGameActive: false,
  comment: '',
};

export default function ChessScreen() {
  const [gameStat, setGameStat] = useState<GameStatInterface>(startPositions);
  const [showMoveIndex, setShowMoveIndex] = useState<number | null>(null);

  const [whiteTime, setWhiteTime] = useState<number>(startTime);
  const [blackTime, setBlackTime] = useState<number>(startTime);
  const [modal, setModal] = useState<boolean>(false);

  const timerRef: any = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (gameStat.step && gameStat.isGameActive) {
      timerRef.current = setInterval(() => {
        if (gameStat.step === 'white') {
          setWhiteTime(prev => Math.max(0, prev - 1));
        } else {
          setBlackTime(prev => Math.max(0, prev - 1));
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStat.step, gameStat.isGameActive]);

  useEffect(() => {
    if (gameStat.isGameActive) {
      setShowMoveIndex(null);
    } else {
      setShowMoveIndex(gameStat.piecesPlacementLog.length - 1);
    }
  }, [gameStat.isGameActive]);

  function onPlayerMove() {
    if (gameStat.step === 'white') {
      setWhiteTime(prev => prev + increment);
    } else {
      setBlackTime(prev => prev + increment);
    }
    setGameStat(prev => ({
      ...prev,
      step: prev.step === 'white' ? 'black' : 'white',
    }));

    if (timerRef.current) clearInterval(timerRef.current);
  }

  function OnNewPiecePoint(cell: number, activePiece: PieceType['value']) {
    // user tap again -> remove cell from active
    const newActiveCell = gameStat.activeCell === cell ? null : cell;
    // save active cell to light it on board
    if (gameStat.step === activePiece.color) {
      setGameStat(prev => ({...prev, activeCell: newActiveCell}));
    }
    if (
      activePiece.name &&
      newActiveCell !== null &&
      gameStat.step === activePiece.color
    ) {
      // get routes where the piece can go
      let newRoutes: number[] =
        activePiece.name === 'Knight'
          ? KnightMovement(
              newActiveCell,
              activePiece,
              gameStat.piecesPlacementLog[
                gameStat.piecesPlacementLog.length - 1
              ],
            )
          : activePiece.name === 'Pawn'
          ? PawnMovement(
              newActiveCell,
              activePiece,
              gameStat.piecesPlacementLog[
                gameStat.piecesPlacementLog.length - 1
              ],
              false,
              gameStat.movesHistory[gameStat.movesHistory.length - 1],
            )
          : activePiece.name === 'Rook'
          ? LineMovement(
              newActiveCell,
              activePiece,
              gameStat.piecesPlacementLog[
                gameStat.piecesPlacementLog.length - 1
              ],
              false,
            )
          : activePiece.name === 'Bishop'
          ? DiagonalMovement(
              newActiveCell,
              activePiece,
              gameStat.piecesPlacementLog[
                gameStat.piecesPlacementLog.length - 1
              ],
              false,
            )
          : activePiece.name === 'Queen'
          ? [
              ...DiagonalMovement(
                newActiveCell,
                activePiece,
                gameStat.piecesPlacementLog[
                  gameStat.piecesPlacementLog.length - 1
                ],
                false,
              ),
              ...LineMovement(
                newActiveCell,
                activePiece,
                gameStat.piecesPlacementLog[
                  gameStat.piecesPlacementLog.length - 1
                ],
                false,
              ),
            ]
          : activePiece.name === 'King'
          ? KingMovement(
              newActiveCell,
              activePiece,
              gameStat.piecesPlacementLog[
                gameStat.piecesPlacementLog.length - 1
              ],
              gameStat.castlingInfo[gameStat.castlingInfo.length - 1],
            )
          : [];
      // filter only legal
      newRoutes = newRoutes.filter(
        (i: number) =>
          !IsKingChecked(
            SimulateMove(
              gameStat.piecesPlacementLog[
                gameStat.piecesPlacementLog.length - 1
              ],
              newActiveCell,
              i,
              activePiece,
            ),
            gameStat.step,
          ),
      );
      setGameStat(prev => ({...prev, routeCells: newRoutes}));
    } else {
      setGameStat(prev => ({...prev, activeCell: null, routeCells: []}));
    }
  }

  function CellAction(cell: number, activePiece: PieceType['value']) {
    if (gameStat.gameResult) return false;
    if (
      gameStat.routeCells?.length &&
      gameStat.routeCells.includes(cell) &&
      typeof gameStat.activeCell === 'number'
    ) {
      //if user tap on pieces route to move it

      // calculate new move
      const makeMoveResults = MakeMove(
        gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1],
        gameStat.activeCell,
        cell,
        gameStat.movesHistory[gameStat.movesHistory.length - 1],
      );
      // new piece placement after move
      const newMove: PiecePlacementLogType = makeMoveResults.placement;

      // Illegal check if my king become under attack
      if (IsKingChecked(newMove, gameStat.step)) {
        return false;
      }
      setGameStat(prev => ({...prev, check: null}));
      if (
        IsKingChecked(newMove, gameStat.step === 'white' ? 'black' : 'white')
      ) {
        if (
          IsCheckmate(
            newMove,
            gameStat.step === 'white' ? 'black' : 'white',
            gameStat.movesHistory[gameStat.movesHistory.length - 1],
          )
        ) {
          // checkmate
          setGameStat(prev => ({
            ...prev,
            checkmate: prev.step === 'white' ? 'black' : 'white',
            gameResult: prev.step,
            isGameActive: false,
          }));
        } else {
          // check
          setGameStat(prev => ({
            ...prev,
            check: prev.step === 'white' ? 'black' : 'white',
          }));
        }
      } else if (
        IsStalemate(newMove, gameStat.step === 'white' ? 'black' : 'white')
      ) {
        setGameStat(prev => ({
          ...prev,
          gameResult: 'draw',
          isGameActive: false,
          comment: 'Stalemate',
        }));
      } else if (OnlyKingsLeft(newMove)) {
        setGameStat(prev => ({
          ...prev,
          gameResult: 'draw',
          isGameActive: false,
          comment: 'Bare Kings',
        }));
      }
      // save new piece placement + write history
      if (newMove) {
        setGameStat(prev => ({
          ...prev,
          movesHistory: [
            ...prev.movesHistory,
            {from: Number(gameStat.activeCell), to: cell},
          ],
          piecesPlacementLog: [...prev.piecesPlacementLog, newMove],
          takenPieces: makeMoveResults.taken
            ? [...prev.takenPieces, makeMoveResults.taken]
            : prev.takenPieces,
        }));

        const pieceId =
          gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1][
            gameStat.activeCell
          ].piece?.id;
        // is castle pieces moved
        const newCastling = {
          whiteKingMoved:
            pieceId === 'WK'
              ? true
              : gameStat.castlingInfo[gameStat.castlingInfo.length - 1][
                  'whiteKingMoved'
                ],
          '0RookMoved':
            pieceId === 'WR1'
              ? true
              : gameStat.castlingInfo[gameStat.castlingInfo.length - 1][
                  '0RookMoved'
                ],
          '7RookMoved':
            pieceId === 'WR2'
              ? true
              : gameStat.castlingInfo[gameStat.castlingInfo.length - 1][
                  '7RookMoved'
                ],
          blackKingMoved:
            pieceId === 'BK'
              ? true
              : gameStat.castlingInfo[gameStat.castlingInfo.length - 1][
                  'blackKingMoved'
                ],
          '56RookMoved':
            pieceId === 'BR1'
              ? true
              : gameStat.castlingInfo[gameStat.castlingInfo.length - 1][
                  '56RookMoved'
                ],
          '63RookMoved':
            pieceId === 'BR2'
              ? true
              : gameStat.castlingInfo[gameStat.castlingInfo.length - 1][
                  '63RookMoved'
                ],
        };
        const isPawnPromotion: boolean = IsPawnPromotion(
          gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1],
          gameStat.activeCell,
          cell,
        );
        setGameStat(prev => ({
          ...prev,
          castlingInfo: [...prev.castlingInfo, newCastling],

          activeCell: null,
          routeCells: [],
        }));
        if (
          CheckThreefoldRepetition(
            [...gameStat.piecesPlacementLog, newMove],
            [...gameStat.castlingInfo, newCastling],
          )
        ) {
          setGameStat(prev => ({
            ...prev,
            isGameActive: false,
            gameResult: 'draw',
            comment: 'Threefold Repetition',
          }));
        }
        if (isPawnPromotion) {
          setModal(true);
          return;
        }

        onPlayerMove();
      }

      return;
    } else if (
      gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1][cell]
        .status === 'free'
    ) {
      // user tap on ampty board -> remove cell from active + clear shown routes
      setGameStat(prev => ({
        ...prev,
        activeCell: null,
        routeCells: [],
      }));
      return;
    }

    OnNewPiecePoint(cell, activePiece);
  }

  const handleCellPress = useCallback(
    (cell: number, activePiece: any) => {
      CellAction(cell, activePiece);
    },
    [gameStat.activeCell, gameStat.routeCells, gameStat.step],
  );

  useEffect(() => {
    if (whiteTime === 0) {
      setGameStat(prev => ({
        ...prev,
        gameResult: 'black',
        activeCell: null,
        routeCells: [],
        isGameActive: false,
        comment: 'Loss On Time',
      }));
    } else if (blackTime === 0) {
      setGameStat(prev => ({
        ...prev,
        gameResult: 'white',
        activeCell: null,
        routeCells: [],
        isGameActive: false,
        comment: 'Loss On Time',
      }));
    }
  }, [whiteTime, blackTime]);

  function OnNextShow() {
    setShowMoveIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
  }

  function OnPreviousShow() {
    setShowMoveIndex(prev =>
      prev !== null && prev < gameStat.piecesPlacementLog.length - 1
        ? prev + 1
        : prev,
    );
  }

  function OnPromotion(newPiece: any) {
    const to: number =
      gameStat.movesHistory[gameStat.movesHistory.length - 1].to;

    const newCell: PiecePlacementType = {
      ...gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1][
        to
      ],
      piece: {
        name: newPiece,
        color:
          gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1][
            to
          ].piece!.color,
        id: gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1][
          to
        ].piece!.id,
      },
    };

    const newPiecePlacement: PiecePlacementLogType = {
      ...gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1],
      [to]: newCell,
    };
    const newPiecePlacementLog: PiecePlacementLogArrayType = [
      ...gameStat.piecesPlacementLog.slice(
        0,
        gameStat.piecesPlacementLog.length - 1,
      ),
      newPiecePlacement,
    ];

    setGameStat(prev => ({
      ...prev,
      piecesPlacementLog: newPiecePlacementLog,
    }));
    setModal(false);
    onPlayerMove();
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: colors.bg,
        gap: (width - width * 0.12 * 8) / 2,
        paddingVertical: (width - width * 0.12 * 8) / 2,
      }}>
      <StatusBar backgroundColor={colors.bg} barStyle={'light-content'} />
      <PlayerStatBlock
        gameStat={gameStat}
        playerColor="black"
        time={blackTime}
        startTime={startTime}
        increment={increment}
        onStart={(start: boolean) => {
          setGameStat({...startPositions, isGameActive: start});
          setWhiteTime(startTime);
          setBlackTime(startTime);
        }}
        onPrev={OnNextShow}
        onNext={OnPreviousShow}
        showMoveIndex={showMoveIndex}
      />

      <View
        style={{
          width: width * 0.12 * 8,
          aspectRatio: 1,
        }}>
        <FlatList
          inverted
          data={rules.rows}
          renderItem={(item: any) => (
            <RenderRowItem
              row={item}
              onPress={handleCellPress}
              gameStat={gameStat}
              showMoveIndex={showMoveIndex}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(data, index) => ({
            length: width * 0.12,
            offset: width * 0.12 * index,
            index,
          })}
        />
      </View>

      <PlayerStatBlock
        gameStat={gameStat}
        playerColor="white"
        time={whiteTime}
        startTime={startTime}
        increment={increment}
        onStart={() => {}}
        onPrev={OnNextShow}
        onNext={OnPreviousShow}
        showMoveIndex={showMoveIndex}
      />
      <PromotionModal
        visible={modal}
        step={gameStat.step}
        onSelect={OnPromotion}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
