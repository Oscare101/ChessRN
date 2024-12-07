import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import rules from '../constants/rules';
import RenderRowItem from '../components/chess/RenderRowItem';
import {
  GameStatInterface,
  PiecePlacementLogType,
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
  IsCheckmate,
  IsKingChecked,
  IsStalemate,
  OnlyKingsLeft,
  SimulateMove,
} from '../functions/chessFunctions';
import PlayerStatBlock from './PlayerStatBlock';
import startPiecePlacement from '../constants/StartPiecePlacement';

const width = Dimensions.get('screen').width;

export default function ChessScreen() {
  const [gameStat, setGameStat] = useState<GameStatInterface>({
    gameResult: null,
    check: null,
    checkmate: null,
    takenPieces: [],
    step: 'white',
    movesHistory: [],
    activeCell: null,
    routeCells: [],
    castlingInfo: {
      whiteKingMoved: false,
      '0RookMoved': false,
      '7RookMoved': false,
      blackKingMoved: false,
      '56RookMoved': false,
      '63RookMoved': false,
    },
    piecesPlacementLog: startPiecePlacement,
  });

  const dispatch = useDispatch();

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
              gameStat.castlingInfo,
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
        // TODO illegal move
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
          }));
        } else {
          // check
          setGameStat(prev => ({
            ...prev,
            check: prev.step === 'white' ? 'black' : 'white',
          }));
        }
      } else if (
        IsStalemate(newMove, gameStat.step === 'white' ? 'black' : 'white') ||
        OnlyKingsLeft(newMove)
      ) {
        setGameStat(prev => ({
          ...prev,
          gameResult: 'draw',
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
      }

      const pieceId =
        gameStat.piecesPlacementLog[gameStat.piecesPlacementLog.length - 1][
          gameStat.activeCell
        ].piece?.id;
      // is castle pieces moved
      setGameStat(prev => ({
        ...prev,
        castlingInfo: {
          whiteKingMoved:
            pieceId === 'WK' ? true : prev.castlingInfo['whiteKingMoved'],
          '0RookMoved':
            pieceId === 'WR1' ? true : prev.castlingInfo['0RookMoved'],
          '7RookMoved':
            pieceId === 'WR2' ? true : prev.castlingInfo['7RookMoved'],
          blackKingMoved:
            pieceId === 'BK' ? true : prev.castlingInfo['blackKingMoved'],
          '56RookMoved':
            pieceId === 'BR1' ? true : prev.castlingInfo['56RookMoved'],
          '63RookMoved':
            pieceId === 'BR2' ? true : prev.castlingInfo['63RookMoved'],
        },
        step: prev.step === 'white' ? 'black' : 'white',
        activeCell: null,
        routeCells: [],
      }));
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
    [gameStat.activeCell, gameStat.routeCells],
  );

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
        // step={step}
        // takenPieces={takenPieces}
        // playerColor={'black'}
        // check={check === 'black'}
        // checkmate={checkmate === 'black'}
        // isGameActive={isGameActive}
        // gameResult={gameResult}
        gameStat={gameStat}
        playerColor="black"
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
              // activeCell={activeCell}
              // routeCells={routeCells}
              // piecesPlacementLog={piecesPlacementLog}
              // step={step}
              // lastMove={movesHistory[movesHistory.length - 1]}
              // check={check}
              gameStat={gameStat}
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
      <PlayerStatBlock gameStat={gameStat} playerColor="white" />
    </View>
  );
}

const styles = StyleSheet.create({});
