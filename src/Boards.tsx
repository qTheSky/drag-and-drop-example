import React, {DragEvent, useState} from 'react';
import {Container, Paper} from '@mui/material';
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
		const [boardFromTakenItem, setBoardFromTakenItem] = useState(null as unknown as Board)
		const [currentDraggedItem, setCurrentDraggedItem] = useState(null as unknown as BoardItem)

		const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
				e.preventDefault()
				if (e.currentTarget.id === 'item') {
						e.currentTarget.style.borderBottom = '3px solid gray'
				}
		}

		const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
				removeBoardItemBorderBottom(e)
		}

		const dragStartHandler = (e: DragEvent<HTMLDivElement>, board: Board, item: BoardItem) => {
				setBoardFromTakenItem(board)
				setCurrentDraggedItem(item)
		}

		const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
				removeBoardItemBorderBottom(e)
		}


		const dropHandler = (e: DragEvent<HTMLDivElement>, newBoard: Board, item: BoardItem) => {
				e.stopPropagation()
				setBoards(boards.map(b => {
						if (b.id === newBoard.id) {
								const dropIndex = newBoard.items.indexOf(item)
								newBoard.items.splice(dropIndex + 1, 0, currentDraggedItem)
						}
						if (b.id === boardFromTakenItem.id) {
								removeItemFromOldBoard()
						}
						return b
				}))
				removeBoardItemBorderBottom(e)
		}

		const onBoardDropHandler = (e: DragEvent<HTMLDivElement>, newBoard: Board) => {
				setBoards(boards.map(b => {
						if (b.id === newBoard.id) {
								b.items.push(currentDraggedItem)
						}
						if (b.id === boardFromTakenItem.id) {
								removeItemFromOldBoard()
						}
						return b
				}))
				removeBoardItemBorderBottom(e)
		}

		const removeItemFromOldBoard = () => {
				const currentIndex = boardFromTakenItem.items.indexOf(currentDraggedItem)
				return boardFromTakenItem.items.splice(currentIndex, 1)
		}

		const removeBoardItemBorderBottom = (e: DragEvent<HTMLDivElement>) => {
				if (e.currentTarget.id === 'item') {
						e.currentTarget.style.borderBottom = 'none'
				}
		}

		return (
				<div>
						<Container>
								<div style={{display: 'flex', gap: '30px', marginTop: '50px', fontSize: '30px'}}>
										{boards.map(board =>
												<Paper onDragOver={dragOverHandler}
												       elevation={8}
												       id="board"
												       style={{textAlign: 'center', padding: '30px', width: '300px'}}
												       key={board.id}
												       onDrop={(e) => onBoardDropHandler(e, board)}
												>
														<h2>{board.name}</h2>
														{board.items.map(item =>
																<div draggable
																     key={item.id}
																     id="item"
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