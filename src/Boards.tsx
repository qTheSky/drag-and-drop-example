import React, {DragEvent, useState} from 'react';
import {Container, Paper} from "@mui/material";
import {v1} from 'uuid';

export interface BoardItem {
    id: string
    name: string
}

export interface Board {
    id: string
    name: string
    items: BoardItem[]
}

export const Boards = () => {
    const [boards, setBoards] = useState<Board[]>([
            {
                id: v1(), name: 'what to do', items: [
                    {id: v1(), name: 'eat breakfast'},
                    {id: v1(), name: 'go to sleep'},
                    {id: v1(), name: 'learn frontend'},
                ],
            },
            {
                id: v1(), name: 'what to buy', items: [
                    {id: v1(), name: 'milk'},
                    {id: v1(), name: 'bread'},
                ],
            },
            {
                id: v1(), name: 'what not to do', items: [
                    {id: v1(), name: 'kill people'},
                    {id: v1(), name: 'sell drugs'},
                ],
            },
        ]
    )
    const [currentBoard, setCurrentBoard] = useState<Board | null>(null)
    const [currentItem, setCurrentItem] = useState<BoardItem | null>(null)

    const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.currentTarget.id === 'item') {
            e.currentTarget.style.borderBottom = '3px solid gray'
        }
    }

    const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
        removeBorderBottom(e)
    }

    const dragStartHandler = (e: DragEvent<HTMLDivElement>, board: Board, item: BoardItem) => {
        setCurrentBoard(board)
        setCurrentItem(item)
    }

    const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
        removeBorderBottom(e)
    }


    const dropHandler = (e: DragEvent<HTMLDivElement>, board: Board, item: BoardItem) => {
        e.stopPropagation()
        if (currentItem && currentBoard) {
            const currentIndex = currentBoard.items.indexOf(currentItem)
            currentBoard.items.splice(currentIndex, 1)
            const dropIndex = board.items.indexOf(item)
            board.items.splice(dropIndex + 1, 0, currentItem)
            rerenderBoards(board)
            removeBorderBottom(e)
        }
    }

    const onBoardDropHandler = (e: DragEvent<HTMLDivElement>, board: Board) => {
        if (currentItem && currentBoard) {
            board.items.push(currentItem)
            const currentIndex = currentBoard.items.indexOf(currentItem)
            currentBoard.items.splice(currentIndex, 1)
            rerenderBoards(board)
            removeBorderBottom(e)
        }
    }

    const removeBorderBottom = (e: DragEvent<HTMLDivElement>) => {
        if (e.currentTarget.id === 'item') {
            e.currentTarget.style.borderBottom = 'none'
        }
    }
    const rerenderBoards = (board: Board) => {
        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board
            }
            if (b.id === currentBoard?.id) {
                return currentBoard
            }
            return b
        }))
    }

    return (
        <div>
            <Container>
                <div style={{display: 'flex', gap: '30px', marginTop: '50px', fontSize: '30px'}}>
                    {boards.map(board =>
                        <Paper onDragOver={dragOverHandler}
                               elevation={8}
                               id='board'
                               style={{textAlign: 'center', padding: '30px', width: '300px'}}
                               key={board.id}
                               onDrop={(e) => onBoardDropHandler(e, board)}
                        >
                            <h2>{board.name}</h2>
                            {board.items.map(item =>
                                <div draggable
                                     key={item.id}
                                     id='item'
                                     onDragOver={dragOverHandler}
                                     onDragLeave={dragLeaveHandler}
                                     onDragStart={(e) => dragStartHandler(e, board, item)}
                                     onDragEnd={dragEndHandler}
                                     onDrop={(e) => dropHandler(e, board, item)}
                                >
                                    {item.name}
                                </div>)
                            }
                        </Paper>
                    )}
                </div>
            </Container>
        </div>
    )
}