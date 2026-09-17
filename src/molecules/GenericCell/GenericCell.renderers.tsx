import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { AntSwitch } from "./AntSwitch";
import { PriorityBadge } from "../../atoms/PriorityBadge/PriorityBadge";
import { BoxBadge } from "../../atoms/BoxBadge/BoxBadge";
import { AttentionCode } from "../../atoms/AttentionCode/AttentionCode";
import { WaitingBadge } from "../../atoms/WaitingBadge/WaitingBadge";
import { InfoButton } from "../InfoButton/InfoButton";
import { ClinicalStatusIcon } from "../ClinicalStatusIcon/ClinicalStatusIcon";
import "./GenericCell.css";

import {
  UiBloodTestIcon,
  UiConversationIcon,
  UiPrescriptionIcon,
  UiXRaysIcon,
} from "../../atoms/Icon/SvgIconsHce";

import {
  hceBorderRadius,
  hceColors,
  hceTypography,
} from "../../tokens/hce.tokens";

import type { GenericColumnType, GenericTableColumn } from "./GenericCell";

export interface CellRenderContext<T> {
  row: T
  column: GenericTableColumn<T>
  value: unknown
  color?: string
  disabled: boolean
  canClick: boolean
  boldText: boolean
  handleColumnClick: (event: MouseEvent<HTMLElement>) => void
  clickableA11yProps: HTMLAttributes<HTMLElement>
  tooltip?: string
  testId?: string
}

export type CellRenderer<T> = (context: CellRenderContext<T>) => ReactNode;

const clinicalIcons = {
  lab: UiBloodTestIcon,
  img: UiXRaysIcon,
  indication: UiPrescriptionIcon,
  interconsult: UiConversationIcon,
};

type BoxCellValue =
  | {
      label?: string;
      stage: "ESPERA" | "SALA_D" | "BOX_ASIGNADO";
      color?: "green" | "yellow" | "red" | null;
    }
  | undefined;

export const cellRenderers: {
  [K in GenericColumnType]: CellRenderer<any>;
} = {
  priority: ({ value, canClick, handleColumnClick, clickableA11yProps }) => (
    <div
      onClick={handleColumnClick}
      {...clickableA11yProps}
      style={{
        display: "flex",
        justifyContent: "center",
        cursor: canClick ? "pointer" : "default",
      }}
    >
      <PriorityBadge
        priority={value as any}
        cursor={canClick ? "pointer" : "default"}
      />
    </div>
  ),

  box: ({ value, canClick, handleColumnClick, clickableA11yProps }) => {
    const boxie = value as BoxCellValue;

    if (!boxie) return <>-</>;

    return (
      <div
        onClick={handleColumnClick}
        {...clickableA11yProps}
        style={{
          display: "flex",
          justifyContent: "center",
          cursor: canClick ? "pointer" : "default",
        }}
      >
        <BoxBadge
          label={boxie.label}
          stage={boxie.stage}
          color={boxie.color}
          cursor={canClick ? "pointer" : "default"}
        />
      </div>
    );
  },

  "patient-name": ({
    value,
    boldText,
    canClick,
    handleColumnClick,
    clickableA11yProps,
  }) => (
    <span
      onClick={handleColumnClick}
      {...clickableA11yProps}
      style={{
        cursor: canClick ? "pointer" : "default",
        textDecoration: canClick ? "underline" : "none",
        whiteSpace: "nowrap",
        fontSize: hceTypography.size.base,
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "var(--ds-color-primary, #374151)",
        fontWeight: boldText
          ? hceTypography.weight.bold
          : hceTypography.weight.regular,
        display: "block",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {String(value ?? "-")}
    </span>
  ),

  "clinical-status": ({
    column,
    value,
    handleColumnClick,
    clickableA11yProps,
  }) => {
    const icon = column.clinicalIcon
      ? clinicalIcons[column.clinicalIcon]
      : UiBloodTestIcon;

    const status = value ?? "empty";

    return (
      <div
        onClick={handleColumnClick}
        {...clickableA11yProps}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <ClinicalStatusIcon
          status={status as any}
          icon={icon}
          tooltipLabel={`${column.header}: ${String(status)}`}
        />
      </div>
    );
  },

  "attention-code": ({ value, boldText }) => {
    const code = value === "none" || !value ? "-" : String(value);

    return <AttentionCode code={code} bold={boldText} />;
  },

  "info-button": ({
    row,
    column,
    value,
    disabled,
    canClick,
    tooltip,
    testId,
  }) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <InfoButton
        onClick={() => {
          if (!canClick) return;

          column.onClick?.(row, value);
        }}
        disabled={disabled}
        tooltip={tooltip}
        testId={testId}
      />
    </div>
  ),

  "waiting-time": ({ value, color }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WaitingBadge color={color} label={String(value ?? "-")} />
    </div>
  ),

  icon: ({
    column,
    disabled,
    color,
    canClick,
    handleColumnClick,
    clickableA11yProps,
    testId,
  }) => {
    const Icon = column.icon;

    if (!Icon) return null;

    const iconColor = disabled
      ? hceColors.neutro.white[800]
      : color || "var(--ds-color-primary, #374151)";

    const backgroundColor = disabled
      ? "#F2F2F2"
      : `color-mix(in srgb, ${iconColor} 10%, white)`;

    return (
      <div
        onClick={handleColumnClick}
        {...clickableA11yProps}
        data-testid={testId}
        style={{
          width: 28,
          height: 28,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: canClick ? "pointer" : "default",
          border: `1.5px solid ${iconColor}`,
          borderRadius: hceBorderRadius.md,
          backgroundColor,
          boxSizing: "border-box",
        }}
      >
        <Icon
          color={iconColor}
          disable={disabled}
          size={column.iconSize ?? 20}
        />
      </div>
    );
  },

  switch: ({
    row,
    column,
    value,
    disabled,
    testId,
  }) => {
    const checked = column.checkedGetter
      ? column.checkedGetter(row)
      : Boolean(value);

    const showLabel = column.showSwitchLabel ?? false;

    const label = column.switchLabelGetter
      ? column.switchLabelGetter(row, checked)
      : checked
        ? "Sí"
        : "No";

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: showLabel ? "8px" : 0,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <AntSwitch
          checked={checked}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onChange={(event) => {
            event.stopPropagation();

            if (disabled) return;

            column.onClick?.(row, event.target.checked);
          }}
          testId={testId}
        />

        {showLabel && (
          <span
            style={{
              whiteSpace: "nowrap",
              color: "var(--ds-color-primary, #374151)",
              fontSize: hceTypography.size.base,
              fontWeight: checked
                ? hceTypography.weight.bold
                : hceTypography.weight.regular,
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  },

  tag: ({
    value,
    color,
    disabled,
    canClick,
    handleColumnClick,
    clickableA11yProps,
  }) => {
    const label = String(value ?? "-");
    const tagColor = color || "var(--ds-color-primary, #374151)";
    const backgroundColor = `color-mix(in srgb, ${tagColor} 10%, white)`;

    return (
      <div
        onClick={handleColumnClick}
        {...clickableA11yProps}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: canClick ? "pointer" : "default",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 72,
            height: 20,
            padding: "0 8px",
            borderRadius: "999px",
            border: `1px solid ${tagColor}`,
            backgroundColor,
            color: tagColor,
            fontFamily: hceTypography.fontFamily,
            fontSize: "11px",
            fontWeight: hceTypography.weight.medium,
            lineHeight: 1,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
          }}
        >
          {label}
        </span>
      </div>
    );
  },

  text: ({
    value,
    boldText,
    disabled,
    canClick,
    handleColumnClick,
    clickableA11yProps,
  }) => (
    <span
      onClick={handleColumnClick}
      {...clickableA11yProps}
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "var(--ds-color-primary, #374151)",
        fontSize: hceTypography.size.base,
        fontWeight: boldText
          ? hceTypography.weight.bold
          : hceTypography.weight.regular,
        cursor: canClick ? "pointer" : "default",
        textDecoration: canClick ? "underline" : "none",
        opacity: disabled ? 0.5 : 1,
        textAlign: "center",
        display: "block",
      }}
    >
      {String(value ?? "-")}
    </span>
  ),

  list: ({ value, boldText }) => {
    const items = Array.isArray(value)
      ? value
      : value
        ? String(value)
            .split(",")
            .map((item) => item.trim())
        : [];

    if (items.length === 0) return <>-</>;

    return (
      <ul
        className={`hce-generic-cell-list${boldText ? " hce-generic-cell-list--bold" : ""}`}
      >
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="hce-generic-cell-list__item">
            {String(item)}
          </li>
        ))}
      </ul>
    );
  },

  datetime: ({ value, boldText }) => {
    const text = String(value ?? "-");

    return (
      <span
        style={{
          display: "block",
          whiteSpace: "normal", // ← permite wrap natural, no fuerza nada
          wordBreak: "break-word",
          textAlign: "center",
          lineHeight: 1.3,
          color: "var(--ds-color-primary, #374151)",
          fontSize: hceTypography.size.base,
          fontWeight: boldText
            ? hceTypography.weight.bold
            : hceTypography.weight.regular,
        }}
      >
        {text}
      </span>
    );
  },
};
