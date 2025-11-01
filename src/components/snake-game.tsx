'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Pause, Play, RotateCcw, Square } from "lucide-react"

type Point = {
  x: number
  y: number
}

type Direction = Point

type GameStatus = "idle" | "running" | "paused" | "over"

const BOARD_SIZE = 20
const INITIAL_SPEED = 140
const POINTS_PER_FOOD = 10
const INITIAL_DIRECTION: Direction = { x: 1, y: 0 }
const HIGH_SCORE_STORAGE_KEY = "snake-high-score"

const createInitialSnake = (): Point[] => {
  const startX = Math.floor(BOARD_SIZE / 2)
  const startY = Math.floor(BOARD_SIZE / 2)

  return Array.from({ length: 4 }, (_, index) => ({
    x: startX - index,
    y: startY,
  }))
}

const getRandomFoodPosition = (occupied: Point[]): Point => {
  const freeCells: Point[] = []

  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const isOccupied = occupied.some((segment) => segment.x === x && segment.y === y)

      if (!isOccupied) {
        freeCells.push({ x, y })
      }
    }
  }

  if (freeCells.length === 0) {
    return occupied[0] ?? { x: 0, y: 0 }
  }

  return freeCells[Math.floor(Math.random() * freeCells.length)]
}

const statusLabels: Record<GameStatus, string> = {
  idle: "Ready",
  running: "Running",
  paused: "Paused",
  over: "Game Over",
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(() => createInitialSnake())
  const [food, setFood] = useState<Point>(() => getRandomFoodPosition(createInitialSnake()))
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [status, setStatus] = useState<GameStatus>("idle")

  const animationFrameRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const snakeRef = useRef<Point[]>(snake)
  const foodRef = useRef<Point>(food)
  const directionRef = useRef<Direction>(direction)
  const pendingDirectionRef = useRef<Direction | null>(null)
  const scoreRef = useRef<number>(score)
  const highScoreRef = useRef<number>(highScore)
  const statusRef = useRef<GameStatus>(status)
  const speedRef = useRef<number>(INITIAL_SPEED)

  useEffect(() => {
    snakeRef.current = snake
  }, [snake])

  useEffect(() => {
    foodRef.current = food
  }, [food])

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    highScoreRef.current = highScore
  }, [highScore])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  const setHighScoreWithPersistence = useCallback((value: number) => {
    setHighScore(value)
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, JSON.stringify(value))
      }
    } catch (error) {
      console.error("Failed to persist high score", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const storedHighScore = window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY)

    if (storedHighScore) {
      const parsed = Number.parseInt(storedHighScore, 10)

      if (!Number.isNaN(parsed)) {
        highScoreRef.current = parsed
        setHighScore(parsed)
      }
    }
  }, [])

  const resetGameState = useCallback(() => {
    const initialSnake = createInitialSnake()
    const initialFood = getRandomFoodPosition(initialSnake)

    pendingDirectionRef.current = null
    speedRef.current = INITIAL_SPEED
    lastFrameTimeRef.current = null

    snakeRef.current = initialSnake
    setSnake(initialSnake)

    directionRef.current = INITIAL_DIRECTION
    setDirection(INITIAL_DIRECTION)

    foodRef.current = initialFood
    setFood(initialFood)

    scoreRef.current = 0
    setScore(0)
  }, [])

  const handleGameOver = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    lastFrameTimeRef.current = null
    pendingDirectionRef.current = null

    if (statusRef.current !== "over") {
      statusRef.current = "over"
      setStatus("over")
    }
  }, [])

  const advanceGame = useCallback(() => {
    if (statusRef.current !== "running") {
      return
    }

    if (pendingDirectionRef.current) {
      directionRef.current = pendingDirectionRef.current
      setDirection(pendingDirectionRef.current)
      pendingDirectionRef.current = null
    }

    const currentSnake = snakeRef.current
    const currentDirection = directionRef.current

    if (currentSnake.length === 0) {
      return
    }

    const currentHead = currentSnake[0]
    const nextHead: Point = {
      x: currentHead.x + currentDirection.x,
      y: currentHead.y + currentDirection.y,
    }

    const hitsWall =
      nextHead.x < 0 ||
      nextHead.x >= BOARD_SIZE ||
      nextHead.y < 0 ||
      nextHead.y >= BOARD_SIZE

    const hitsSelf = currentSnake.some(
      (segment, index) => index !== 0 && segment.x === nextHead.x && segment.y === nextHead.y,
    )

    if (hitsWall || hitsSelf) {
      handleGameOver()
      return
    }

    let nextSnake = [nextHead, ...currentSnake]
    let nextFood = foodRef.current
    let nextScore = scoreRef.current

    const consumesFood = nextHead.x === nextFood.x && nextHead.y === nextFood.y

    if (consumesFood) {
      nextScore += POINTS_PER_FOOD
      nextFood = getRandomFoodPosition(nextSnake)

      scoreRef.current = nextScore
      setScore(nextScore)

      foodRef.current = nextFood
      setFood(nextFood)

      if (nextScore > highScoreRef.current) {
        highScoreRef.current = nextScore
        setHighScoreWithPersistence(nextScore)
      }
    } else {
      nextSnake = nextSnake.slice(0, -1)
    }

    snakeRef.current = nextSnake
    setSnake(nextSnake)
  }, [handleGameOver, setHighScoreWithPersistence])

  const gameLoop = useCallback(
    (time: number) => {
      if (statusRef.current !== "running") {
        return
      }

      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = time
      }

      const delta = time - (lastFrameTimeRef.current ?? 0)

      if (delta >= speedRef.current) {
        advanceGame()
        lastFrameTimeRef.current = time
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    },
    [advanceGame],
  )

  useEffect(() => {
    if (status === "running") {
      animationFrameRef.current = requestAnimationFrame(gameLoop)

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [status, gameLoop])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const startGame = useCallback(() => {
    resetGameState()
    statusRef.current = "running"
    setStatus("running")
  }, [resetGameState])

  const pauseGame = useCallback(() => {
    if (statusRef.current !== "running") {
      return
    }

    statusRef.current = "paused"
    setStatus("paused")
  }, [])

  const resumeGame = useCallback(() => {
    if (statusRef.current !== "paused") {
      return
    }

    lastFrameTimeRef.current = null
    statusRef.current = "running"
    setStatus("running")
  }, [])

  const handleDirectionInput = useCallback((next: Direction) => {
    if (statusRef.current === "idle" || statusRef.current === "over") {
      startGame()
      pendingDirectionRef.current = next
      directionRef.current = next
      setDirection(next)
      return
    }

    const activeDirection = pendingDirectionRef.current ?? directionRef.current

    const isOpposite = activeDirection.x + next.x === 0 && activeDirection.y + next.y === 0

    if (isOpposite) {
      return
    }

    pendingDirectionRef.current = next
  }, [setDirection, startGame])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key
      const normalizedKey = key.toLowerCase()

      const directionMap: Record<string, Direction> = {
        arrowup: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        arrowdown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        arrowleft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        arrowright: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      }

      if (directionMap[normalizedKey]) {
        event.preventDefault()
        handleDirectionInput(directionMap[normalizedKey])
        return
      }

      if (key === " " || normalizedKey === "space") {
        event.preventDefault()

        if (statusRef.current === "running") {
          pauseGame()
        } else if (statusRef.current === "paused") {
          resumeGame()
        }
      }

      if (normalizedKey === "enter") {
        event.preventDefault()

        if (statusRef.current === "idle" || statusRef.current === "over") {
          startGame()
        }
      }
    },
    [handleDirectionInput, pauseGame, resumeGame, startGame],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const boardCells = useMemo(() => {
    const cells: ReactNode[] = []
    const snakePositions = new Set(snake.map((segment) => `${segment.x}-${segment.y}`))
    const headKey = snake[0] ? `${snake[0].x}-${snake[0].y}` : null
    const foodKey = `${food.x}-${food.y}`

    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const key = `${x}-${y}`
        const isHead = key === headKey
        const isSnake = snakePositions.has(key)
        const isFood = key === foodKey

        cells.push(
          <div
            key={key}
            className={cn(
              "rounded-[4px] transition-colors duration-150",
              isHead && "bg-emerald-500 shadow-[0_0_0_1px_rgba(15,118,110,0.4)]",
              !isHead && isSnake && "bg-emerald-400/80",
              isFood && "bg-amber-400",
              !isSnake && !isFood && "bg-secondary/60",
            )}
          />,
        )
      }
    }

    return cells
  }, [snake, food])

  const canPause = status === "running"
  const canResume = status === "paused"
  const showStart = status === "idle"
  const showRestart = status === "running" || status === "paused"
  const showPlayAgain = status === "over"

  return (
    <Card className="w-full max-w-3xl border-border/60 bg-card/80 backdrop-blur">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl font-semibold">Snake</CardTitle>
            <CardDescription>
              Use your arrow keys or WASD to guide the snake. Collect food, avoid walls, and don&apos;t eat yourself.
            </CardDescription>
          </div>
          <Badge
            variant={status === "running" ? "default" : status === "over" ? "destructive" : "secondary"}
            className="min-w-[96px] justify-center text-sm"
          >
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border/60 bg-background/50 p-3 shadow-inner">
            <p className="text-xs font-medium text-muted-foreground">Score</p>
            <p className="text-2xl font-semibold text-foreground">{score}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 p-3 shadow-inner">
            <p className="text-xs font-medium text-muted-foreground">High Score</p>
            <p className="text-2xl font-semibold text-foreground">{highScore}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 p-3 shadow-inner">
            <p className="text-xs font-medium text-muted-foreground">Direction</p>
            <p className="text-2xl font-semibold">
              {direction.x === 1 && direction.y === 0 && "→"}
              {direction.x === -1 && direction.y === 0 && "←"}
              {direction.x === 0 && direction.y === -1 && "↑"}
              {direction.x === 0 && direction.y === 1 && "↓"}
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/50 p-3 shadow-inner">
            <p className="text-xs font-medium text-muted-foreground">Controls</p>
            <p className="text-xs text-muted-foreground">
              Space to pause • Enter to restart
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div
            className="aspect-square w-full rounded-2xl border border-border/80 bg-background/60 p-2 shadow-lg"
            role="application"
            aria-label="Snake game board"
          >
            <div
              className="grid h-full w-full gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {boardCells}
            </div>
          </div>

          {status === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/80 bg-background/90 backdrop-blur">
              <div className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">Game Over</p>
                <p className="text-3xl font-bold text-foreground">Final Score: {score}</p>
                <p className="text-sm text-muted-foreground">Press Enter or Play Again to restart</p>
              </div>
              <Button onClick={startGame} className="gap-2">
                <RotateCcw className="size-4" /> Play Again
              </Button>
            </div>
          )}

          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/50 bg-background/80 backdrop-blur">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-foreground">Ready to play?</p>
                <p className="text-sm text-muted-foreground">
                  Press Start, hit Enter, or move with the arrow keys to begin.
                </p>
              </div>
              <Button onClick={startGame} size="lg" className="gap-2">
                <Play className="size-4" /> Start Game
              </Button>
            </div>
          )}

          {status === "paused" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/80 bg-background/80 backdrop-blur">
              <p className="text-lg font-semibold text-foreground">Paused</p>
              <Button onClick={resumeGame} className="gap-2">
                <Play className="size-4" /> Resume
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {(showStart || showPlayAgain) && (
            <Button onClick={startGame} size="lg" className="gap-2">
              <Play className="size-4" /> {showPlayAgain ? "Play Again" : "Start Game"}
            </Button>
          )}

          {showRestart && (
            <Button onClick={startGame} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="size-4" /> Restart
            </Button>
          )}

          {canPause && (
            <Button onClick={pauseGame} variant="secondary" size="lg" className="gap-2">
              <Pause className="size-4" /> Pause
            </Button>
          )}

          {canResume && (
            <Button onClick={resumeGame} variant="secondary" size="lg" className="gap-2">
              <Play className="size-4" /> Resume
            </Button>
          )}

          {status === "running" && (
            <Button
              onClick={() => {
                handleGameOver()
              }}
              variant="ghost"
              size="lg"
              className="gap-2"
            >
              <Square className="size-4" /> Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
