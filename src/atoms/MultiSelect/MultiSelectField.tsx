import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import "./MultiSelectField.css";
import { hceColors } from "../../tokens/hce.tokens";
import { Checkbox } from "../Checkbox/Checkbox";
import { Menu } from "../Menu/Menu";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Activa el estado de error: todo cambia a rojo */
  error?: boolean;
  /** Muestra la opción "Todos" al inicio de la lista, que selecciona/deselecciona
   * todas las opciones a la vez. Default: true */
  showSelectAll?: boolean;
  /** Se dispara con debounce (ver debounceMs) al escribir en el buscador,
   * una vez alcanzado minSearchLength — mismo patrón que
   * molecules/SearchComboInput/onSearch — para que el padre pueda resolver
   * la búsqueda contra una API en vez de depender solo del filtrado
   * client-side sobre `options`. Opcional: sin este prop el comportamiento
   * es 100% el filtrado local de siempre, sin cambios. */
  onSearch?: (query: string) => void;
  /** Cantidad mínima de caracteres para disparar onSearch. Default: 2 (mismo
   * default que SearchComboInput). Ignorado si no se pasa onSearch. */
  minSearchLength?: number;
  /** ms de debounce antes de disparar onSearch. Default: 300. */
  debounceMs?: number;
  /** Muestra un estado de carga en el listbox mientras el padre resuelve una
   * búsqueda async disparada por onSearch — las opciones previas se
   * mantienen visibles debajo del spinner, no se reemplazan por un mensaje. */
  loading?: boolean;
  /** Hook de pruebas E2E — id base, aplicado al trigger. */
  testId?: string;
}

/** Ícono de "ojo" — visibility del resumen de seleccionados */
function VisibilityGlyph() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.9 }}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Ícono "X" — botón de limpiar toda la selección (paridad con el clear de MUI Autocomplete) */
function ClearGlyph() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Sentinel que representa la fila "Todos" — no es un value real del catálogo
// de `options`, así que se resuelve aparte en toggleOption() en vez de mezclarse
// con los values reales que sí viajan en `value`/`onChange`.
const ALL_VALUE = "__all__";

/**
 * MultiSelect — reemplazo de MUI Autocomplete (multiple + disableCloseOnSelect
 * + checkboxes por opción), como listbox custom en CSS/HTML puro siguiendo el
 * mismo patrón que molecules/SearchComboInput (click-outside cierra, teclado
 * ArrowUp/Down/Enter/Escape, sin depender de MUI Popper).
 *
 * `disabled=true` bloquea abrir el trigger/dropdown por completo (cambio
 * deliberado respecto a la paridad original con MUI Autocomplete, que no
 * bloqueaba el trigger — ver historial de este archivo si hace falta
 * recuperar ese comportamiento).
 */
export const MultiSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "-Seleccionar Opción-",
  fullWidth = true,
  disabled,
  required,
  error,
  showSelectAll = true,
  onSearch,
  minSearchLength = 2,
  debounceMs = 300,
  loading = false,
  testId,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [menuWidth, setMenuWidth] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerId = useId();
  const listId = useId();

  // Limpia el debounce pendiente al desmontar — evita disparar onSearch
  // sobre un componente que ya no está montado.
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const accentColor = disabled
    ? hceColors.neutro.black[300]
    : error
      ? hceColors.alert.error[600]
      : `var(--ds-color-interactive, ${hceColors.primary.blue[600]})`;

  const activeColor = disabled
    ? hceColors.neutro.black[300]
    : error
      ? hceColors.alert.error[600]
      : `var(--ds-color-interactive, ${hceColors.primary.blue[600]})`;

  const textDefaultColor = disabled
    ? hceColors.neutro.black[300]
    : error
      ? hceColors.alert.error[600]
      : hceColors.neutro.black[400];

  const selectedOptions = options.filter((opt) =>
    (value ?? []).includes(opt.value),
  );

  const allSelected =
    options.length > 0 && selectedOptions.length === options.length;

  const sortedOptions = useMemo(() => {
    const selectedSet = new Set(value);
    return [...options].sort((a, b) => {
      const aSelected = selectedSet.has(a.value);
      const bSelected = selectedSet.has(b.value);
      if (aSelected === bSelected) return 0;
      return aSelected ? -1 : 1;
    });
  }, [options, value]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  // Los ya seleccionados nunca se excluyen por el filtro de texto — deben
  // seguir visibles y anclados arriba (ver sortedOptions) aunque su label no
  // matchee la búsqueda actual, o el usuario pierde de vista lo que ya elegió
  // en cuanto escribe algo para buscar OTRO elemento distinto.
  const filteredOptions = normalizedQuery
    ? sortedOptions.filter(
        (opt) =>
          value.includes(opt.value) ||
          opt.label.toLowerCase().includes(normalizedQuery),
      )
    : sortedOptions;

  useEffect(() => {
    setActiveIdx(-1);
  }, [normalizedQuery]);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      // Avisar al padre que ya no hay texto de búsqueda activo — sin esto,
      // al reabrir el input se ve vacío pero `options` sigue siendo el
      // resultado de la última búsqueda (el padre nunca se entera de que
      // el texto se limpió), y el listbox queda mostrando información
      // "fantasma" que no corresponde a lo que el usuario ve tecleado.
      onSearch?.("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const listOptions: Option[] =
    showSelectAll && !normalizedQuery
      ? [{ value: ALL_VALUE, label: "Todos" }, ...filteredOptions]
      : filteredOptions;

  function openMenu() {
    if (disabled) return;
    setMenuWidth(triggerRef.current?.getBoundingClientRect().width);
    setOpen(true);
  }

  function toggleOption(optionValue: string) {
    if (disabled) return;

    if (optionValue === ALL_VALUE) {
      onChange(allSelected ? [] : options.map((o) => o.value));
      return;
    }

    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(next);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        openMenu();
        setActiveIdx(0);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, listOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && listOptions[activeIdx]) {
        toggleOption(listOptions[activeIdx].value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const cssVars = {
    "--ms-main": accentColor,
    "--ms-active": activeColor,
    "--ms-text": textDefaultColor,
    "--ms-focus-ring": hceColors.primary.blue[100],
    "--ms-summary-bg": hceColors.primary.green[600],
    "--ms-clear-icon": hceColors.neutro.black[400],
  } as CSSProperties;

  if (!label) return null;

  // Único elemento raíz: `hce-multiselect-wrapper` ya envolvía todo lo demás
  // (label, fila del trigger, <Menu>) — no hace falta un <div> extra por
  // fuera. El botón "limpiar todo" vive DENTRO de `hce-multiselect-trigger-row`
  // (mismo contenedor position:relative que el input), no como hermano
  // suelto de esa fila: si queda afuera, se posiciona relativo al wrapper
  // completo (que incluye el <label> de arriba) en vez de relativo solo a
  // la fila del input, y el centrado vertical del ícono "X" queda corrido.
  return (
    <div
      ref={containerRef}
      className="hce-multiselect-wrapper"
      style={{
        ...cssVars,
        position: "relative",
        width: fullWidth ? "100%" : undefined,
      }}
    >
      <label id={triggerId} className="hce-multiselect-label">
        {label}
      </label>

      <div
        className="hce-multiselect-trigger-row"
        style={{ position: "relative" }}
      >
        <input
          ref={triggerRef}
          type="text"
          role="combobox"
          className={`hce-multiselect-trigger${disabled ? " hce-multiselect-trigger--disabled" : ""}`}
          disabled={disabled}
          value={
            open
              ? searchQuery
              : value.length > 0
                ? `${value.length} seleccionado${value.length > 1 ? "s" : ""}`
                : ""
          }
          placeholder={open ? "Buscar..." : placeholder}
          autoComplete="off"
          onFocus={() => {
            if (!disabled) openMenu();
          }}
          onChange={(e) => {
            const q = e.target.value;
            setSearchQuery(q);
            if (!open) openMenu();

            if (onSearch) {
              if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
              if (q.trim().length >= minSearchLength) {
                searchTimerRef.current = setTimeout(
                  () => onSearch(q),
                  debounceMs,
                );
              } else {
                // Por debajo del umbral (incluido vacío): avisar de
                // inmediato, sin debounce, para que el padre pueda
                // descartar el resultado de una búsqueda previa en vez de
                // dejarlo mostrado sin respaldo en el texto tecleado.
                onSearch(q);
              }
            }
          }}
          onKeyDown={handleInputKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIdx >= 0 ? `${listId}-opt-${activeIdx}` : undefined
          }
          aria-labelledby={triggerId}
          aria-required={required}
          data-testid={testId}
          style={{
            // `align-items: center` de .hce-multiselect-trigger centra hijos
            // flex — funcionaba con el <button> anterior porque su contenido
            // era un <span> (hijo flex real). El *value* de un <input> NO es
            // un hijo flex: el navegador lo centra verticalmente según
            // line-height, no según align-items. 38px = 40px de altura menos
            // los 2px de border (1px arriba + 1px abajo) de .hce-multiselect-trigger.
            lineHeight: "38px",
            // Cerrado + con selección: el texto plano del input queda
            // invisible (pero sigue en el DOM, accesible por lector de
            // pantalla) — lo que se VE es la píldora verde superpuesta
            // (overlay de abajo), igual que antes cuando ese contenido
            // vivía directamente dentro del <button>.
            color:
              !open && value.length > 0 ? "transparent" : open ? textDefaultColor : accentColor,
            ...({paddingRight: 36}),
          }}
        />

        {/*
          Overlay decorativo con el resumen "N seleccionados" en su píldora
          verde original — un <input> no puede renderizar JSX dentro de su
          `value`, así que esto se dibuja encima del input real en vez de
          adentro. pointer-events:none para que los clicks caigan sobre el
          input de abajo y abran el dropdown con normalidad; solo se muestra
          cerrado y con selección (abierto, se ve el texto de búsqueda real
          del input).
        */}
        {!open && value.length > 0 && (
          <div
            className="hce-multiselect-trigger"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "transparent",
              boxShadow: "none",
              ...(value.length > 0 && !disabled ? { paddingRight: 36 } : null),
            }}
          >
            <span className="hce-multiselect-summary">
              <span>
                {value.length} seleccionado{value.length > 1 ? "s" : ""}
              </span>
              <VisibilityGlyph />
            </span>
          </div>
        )}

        {value.length > 0 && !disabled && (
          <button
            type="button"
            className="hce-multiselect-clear"
            aria-label="Limpiar selección"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
            }}
          >
            <ClearGlyph />
          </button>
        )}

        {/* Solo mientras el dropdown está abierto y el padre resuelve una
            búsqueda async — las opciones previas siguen visibles debajo, este
            spinner no las reemplaza (ver listbox más abajo). */}
        {open && loading && (
          <span
            className="hce-multiselect-search-spinner"
            style={{
              position: "absolute",
              right: value.length > 0 && !disabled ? 34 : 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={triggerRef}
        align="left"
        role="listbox"
        id={listId}
        aria-multiselectable="true"
        aria-label={label}
        panelClassName="hce-multiselect-listbox"
        panelStyle={{
          width: menuWidth,
          border: `1px solid ${hceColors.primary.blue[100]}`,
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        }}
      >
        {listOptions.length === 0 && (
          <div className="hce-multiselect-empty">
            {loading ? "Buscando..." : `Sin resultados para "${searchQuery}"`}
          </div>
        )}

        {listOptions.map((opt, idx) => {
          const isAllRow = opt.value === ALL_VALUE;
          const selected = isAllRow
            ? allSelected
            : selectedOptions.some((o) => o.value === opt.value);
          return (
            <div
              key={opt.value}
              id={`${listId}-opt-${idx}`}
              role="option"
              aria-selected={selected}
              className={`hce-multiselect-option${activeIdx === idx ? " hce-multiselect-option--active" : ""}${isAllRow ? " hce-multiselect-option--all" : ""}`}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                toggleOption(opt.value);
              }}
              style={{
                cursor: disabled ? "not-allowed" : "pointer",
                pointerEvents: disabled ? "none" : "auto",
                fontWeight: isAllRow ? 700 : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: isAllRow ? 700 : undefined,
                  color: isAllRow
                    ? textDefaultColor
                    : hceColors.neutro.black[400],
                  textAlign: "left",
                  flex: 1,
                  minWidth: 0,
                  marginRight: 8,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.label}
              </span>
              <div
                style={{
                  flex: "0 0 auto",
                  width: "fit-content",
                  pointerEvents: "none",
                }}
              >
                <Checkbox
                  ariaLabel={opt.label}
                  checked={selected}
                  disabled={disabled}
                  onChange={() => {}}
                />
              </div>
            </div>
          );
        })}
      </Menu>
    </div>
  );
};
