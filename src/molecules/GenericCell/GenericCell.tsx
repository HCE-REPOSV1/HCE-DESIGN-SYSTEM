import type {
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from "react"
import { cellRenderers, type CellRenderer } from "./GenericCell.renderers"

export type GenericColumnType =
  | "text"
  | "priority"
  | "box"
  | "patient-name"
  | "clinical-status"
  | "attention-code"
  | "info-button"
  | "waiting-time"
  | "icon"
  | "switch"
  | "tag"
  | "list"
  | "datetime"

export interface GenericTableColumn<T> {
  key: string
  header: string
  type: GenericColumnType
  tooltip?: string
  field?: string
  valueGetter?: (row: T) => unknown

  colorField?: string
  colorGetter?: (row: T) => string | null | undefined

  width?: number | string
  // El ancho declarado sigue siendo un PESO relativo (se estira/encoge
  // proporcionalmente para llenar el contenedor, como siempre). minWidth /
  // maxWidth clampean el resultado en px para columnas que no deben inflarse
  // más allá de cierto punto (íconos/badges) aunque sobre espacio.
  minWidth?: number
  maxWidth?: number
  align?: "left" | "center" | "right"

  clinicalIcon?: "lab" | "img" | "indication" | "interconsult"

  icon?: ComponentType<any>
  iconSize?: number

  checkedGetter?: (row: T) => boolean
  switchLabelGetter?: (row: T, checked: boolean) => string
  showSwitchLabel?: boolean

  clickable?: boolean
  disabledGetter?: (row: T) => boolean

  onClick?: (row: T, value: unknown) => void

  boldGetter?: (row: T) => boolean

  /** Estilo puntual de la celda — objeto plano de CSS (antes SystemStyleObject<Theme> de MUI). */
  cellSx?: CSSProperties

  /**
   * Hook de pruebas E2E — `data-testid` del elemento interactivo de la celda
   * (icon/info-button/switch/tag/etc.), análogo a `getRowTestId` de
   * GenericTable pero a nivel de columna. Debe derivarse de un id técnico
   * opaco de la fila, nunca de datos identificables del paciente.
   */
  getCellTestId?: (row: T) => string
}

interface GenericCellProps<T> {
  row: T
  column: GenericTableColumn<T>
}

const getValueByPath = <T,>(row: T, path?: string) => {
  if (!path) return undefined

  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }

    return undefined
  }, row)
}

export const GenericCell = <T,>({ row, column }: GenericCellProps<T>) => {
  const value = column.valueGetter
    ? column.valueGetter(row)
    : getValueByPath(row, column.field)

  const disabled = column.disabledGetter?.(row) ?? false

  const canClick = Boolean(
    column.clickable &&
      !disabled &&
      column.onClick
  )

  const handleColumnClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (!canClick) return

    column.onClick?.(row, value)
  }

  const handleColumnKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return

    event.preventDefault()
    event.stopPropagation()

    if (!canClick) return

    column.onClick?.(row, value)
  }

  const clickableA11yProps: HTMLAttributes<HTMLElement> = canClick
    ? {
        role: "button",
        tabIndex: 0,
        onKeyDown: handleColumnKeyDown,
      }
    : {}

  const boldText = column.boldGetter?.(row) ?? false

  const color = column.colorGetter
    ? column.colorGetter(row)
    : column.colorField
      ? getValueByPath(row, column.colorField)
      : undefined

  const render = cellRenderers[column.type] as CellRenderer<T>

  return (
    <>
      {render({
        row,
        column,
        value,
        color: color ? String(color) : undefined,
        disabled,
        canClick,
        boldText,
        handleColumnClick,
        clickableA11yProps,
        tooltip: column.tooltip,
        testId: column.getCellTestId?.(row),
      })}
    </>
  )
}