import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import "./SelectField.css";
import { hceColors } from "../../tokens/hce.tokens";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Activa el estado de error: todo cambia a rojo */
  error?: boolean;
  /**
   * Altura máxima (px) del desplegable antes de hacer scroll. Ahora sí
   * funcional: el listbox es custom (ya no depende del popup nativo del
   * navegador). Default: 260.
   */
  menuMaxHeight?: number;
  /** Hook de pruebas E2E — `data-testid` en el trigger. */
  testId?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "-Seleccionar Opción-",
  fullWidth = true,
  disabled = false,
  error = false,
  menuMaxHeight = 260,
  testId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef({
    text: "",
    timeoutId: 0 as unknown as ReturnType<typeof setTimeout>,
  });

  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
    placement: "bottom" | "top";
  } | null>(null);

  const selectedIndex = useMemo(
    () => options.findIndex((opt) => opt.value === value),
    [options, value],
  );
  const selectedOption =
    selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // ── Colores reactivos ──────────────────────────────────────
  const mainColor = disabled
    ? hceColors.neutro.black[300]
    : error
      ? hceColors.alert.error[600]
      : `var(--ds-color-interactive, ${hceColors.primary.blue[600]})`;

  const hasValue = Boolean(value);
  const valueColor = !hasValue
    ? mainColor
    : disabled
      ? hceColors.neutro.black[300]
      : error
        ? hceColors.alert.error[600]
        : hceColors.primary.blue[600];

  const cssVars = {
    "--sf-main": mainColor,
    "--sf-value-default": valueColor,
    "--sf-value-active": valueColor,
    "--sf-focus-ring": hceColors.primary.blue[100],
    "--sf-menu-max-height": `${menuMaxHeight}px`,
    "--sf-selected-bg": hceColors.primary.blue[600], // ← nueva, fija, no theme-aware
  } as CSSProperties;

  // Cierra al hacer click afuera (revisa tanto el trigger/label como el
  // listbox en el portal). Usa fase de captura (tercer argumento `true`)
  // para no depender del burbujeo del evento — algunos componentes de MUI
  // (Modal/Backdrop/FocusTrap) detienen la propagación en fase de burbuja,
  // lo que impediría que este listener se ejecute si estuviera en esa fase.
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideRoot = rootRef.current?.contains(target);
      const clickedInsideList = listRef.current?.contains(target);
      if (!clickedInsideRoot && !clickedInsideList) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, [open]);

  // Al abrir, posiciona el índice activo en la opción seleccionada (o la primera)
  useEffect(() => {
    if (open) {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [open, selectedIndex]);

  // Mantiene la opción activa visible mientras se navega por teclado
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLLIElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commitSelection = (index: number) => {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTypeahead = (key: string) => {
    const state = typeaheadRef.current;
    clearTimeout(state.timeoutId);
    state.text += key.toLowerCase();
    const matchIndex = options.findIndex((opt) =>
      opt.label.toLowerCase().startsWith(state.text),
    );
    if (matchIndex >= 0) setActiveIndex(matchIndex);
    state.timeoutId = setTimeout(() => {
      state.text = "";
    }, 500);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        e.preventDefault();
        setOpen(true);
        break;
      case "Escape":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          setOpen(true);
          handleTypeahead(e.key);
        }
    }
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commitSelection(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          handleTypeahead(e.key);
        }
    }
  };

  // Foco automático en el listbox al abrir, para que las flechas funcionen de inmediato
  useEffect(() => {
    if (open) {
      listRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // Cierra el popup si cualquier ancestro con scroll se mueve (mismo
  // comportamiento que un <select> nativo). Se ignora el scroll interno
  // del propio listbox, que es solo la navegación de opciones.
  useEffect(() => {
    if (!open) return;

    const handleScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("scroll", handleScroll, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  // Calcula la posición del popup en coordenadas de viewport (fixed).
  // useLayoutEffect (no useEffect) para correr antes del pintado, y un
  // doble rAF de respaldo para recapturar la posición si algo (como un
  // panel de Storybook expandiéndose) desplaza el layout justo después
  // de abrir.
  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Altura real del menú si ya se renderizó antes (rAF de respaldo);
      // en el primer cálculo, usa menuMaxHeight como estimado conservador
      const menuHeight = listRef.current?.offsetHeight || menuMaxHeight;

      // Abre hacia arriba solo si no entra abajo Y sí entra arriba
      // (evita el caso raro de "no entra en ningún lado" abriendo hacia
      // el lado con más espacio disponible aunque tampoco alcance del todo)
      const shouldFlipUp =
        spaceBelow < menuHeight + 4 && spaceAbove > spaceBelow;
      setMenuPosition({
        top: shouldFlipUp
          ? rect.top - 4 // se posiciona pegado arriba del trigger
          : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        placement: shouldFlipUp ? "top" : "bottom",
      });
    };

    updatePosition();

    const rafId = requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, menuMaxHeight]);

  const reactId = useId();
  const listboxId = `hce-selectfield-${reactId}-listbox`;

  return (
    <div ref={rootRef}>
      <label className="hce-selectfield-label" style={cssVars}>
        {label}
      </label>
      <div
        className={`hce-selectfield-box${fullWidth ? " hce-selectfield-box--full-width" : ""}${open ? " hce-selectfield-box--open" : ""}`}
        style={cssVars}
      >
        <button
          ref={triggerRef}
          type="button"
          className="hce-selectfield-trigger"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleTriggerKeyDown}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          data-testid={testId}
        >
          <span className="hce-selectfield-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </button>
        <span className="hce-selectfield-arrow" aria-hidden="true">
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
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {open &&
        menuPosition &&
        createPortal(
          <ul
            ref={listRef}
            id={listboxId}
            className="hce-selectfield-listbox hce-selectfield-listbox--portal"
            role="listbox"
            tabIndex={-1}
            style={{
              ...cssVars,
              left: menuPosition.left,
              width: menuPosition.width,
              ...(menuPosition.placement === "top"
                ? { bottom: window.innerHeight - menuPosition.top, top: "auto" }
                : { top: menuPosition.top, bottom: "auto" }),
            }}
            onKeyDown={handleListKeyDown}
          >
            {options.map((opt, index) => (
              <li
                key={opt.value}
                data-index={index}
                role="option"
                aria-selected={opt.value === value}
                className={[
                  "hce-selectfield-option",
                  index === activeIndex ? "hce-selectfield-option--active" : "",
                  opt.value === value ? "hce-selectfield-option--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commitSelection(index)}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
